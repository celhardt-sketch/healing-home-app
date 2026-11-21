"""Plan availability, family-trial rules, and checkout parameters.

No Stripe keys required. Run from backend/:

    DATA_DIR=/tmp/thha-plan-tests python test_plans.py
"""

import json
import os
import sqlite3
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch

os.environ.setdefault("DATA_DIR", tempfile.mkdtemp(prefix="thha-plans-"))
os.environ.setdefault("JWT_SECRET", "local-dev-secret")
os.environ.setdefault("ADMIN_SETUP_KEY", "local-admin-key")

from app.database import _migrate_add_columns, get_db, init_db  # noqa: E402
from app.stripe_billing import (  # noqa: E402
    _handle_checkout_completed,
    _handle_subscription_deleted,
    _handle_subscription_upsert,
    _unmapped_plan_sync,
    available_plans,
    build_checkout_params,
    confirm_checkout_session,
    create_checkout_session,
    get_user_subscription_status,
    remember_plan_from_stripe,
)


PRICE_MONTH = "price_month_test"
PRICE_ANNUAL = "price_annual_test"
PRICE_PRO = "price_pro_test"
STRIPE_VARS = (
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_ID",
    "STRIPE_PRICE_ID_ANNUAL",
    "STRIPE_PRICE_ID_PRO",
)


class StripeObj:
    """Enough of a StripeObject for _as_dict, which does json.loads(str(obj))."""

    def __init__(self, payload: dict):
        self.payload = payload

    def __str__(self) -> str:
        return json.dumps(self.payload)


def subscription_payload(price_id: str, status: str = "active", trial_end=None, sub_id: str = "sub_1") -> dict:
    return {
        "id": sub_id,
        "customer": "cus_1",
        "status": status,
        "cancel_at_period_end": False,
        "trial_end": trial_end,
        "metadata": {"user_id": "1"},
        "items": {"data": [{"price": {"id": price_id}}]},
    }


class EnvCase(unittest.TestCase):
    def setUp(self):
        self._saved = {name: os.environ.get(name) for name in STRIPE_VARS}
        self.data_dir = tempfile.mkdtemp(prefix="thha-plans-")
        os.environ["DATA_DIR"] = self.data_dir
        os.environ["STRIPE_SECRET_KEY"] = "sk_test_placeholder"
        os.environ["STRIPE_WEBHOOK_SECRET"] = "whsec_placeholder"
        os.environ["STRIPE_PRICE_ID"] = PRICE_MONTH
        os.environ.pop("STRIPE_PRICE_ID_ANNUAL", None)
        os.environ.pop("STRIPE_PRICE_ID_PRO", None)
        _unmapped_plan_sync.clear()
        init_db()

    def tearDown(self):
        for name, value in self._saved.items():
            if value is None:
                os.environ.pop(name, None)
            else:
                os.environ[name] = value

    def insert_user(self, email: str = "caregiver@example.com", **fields) -> int:
        with get_db() as conn:
            cur = conn.execute(
                "INSERT INTO users (name, email, password_hash, salt) VALUES (?, ?, ?, ?)",
                ("Care Giver", email, "hash", "salt"),
            )
            user_id = cur.lastrowid
            for key, value in fields.items():
                conn.execute(f"UPDATE users SET {key} = ? WHERE id = ?", (value, user_id))
            conn.commit()
        return user_id


class PlanAvailabilityTests(EnvCase):
    def test_only_monthly_matches_today(self):
        plans = available_plans()
        self.assertEqual([plan["id"] for plan in plans], ["monthly"])
        self.assertEqual(plans[0]["trial_days"], 0)
        self.assertEqual(plans[0]["amount_display"], "$9.99")
        blob = json.dumps(plans)
        self.assertNotIn(PRICE_MONTH, blob)
        self.assertNotIn("STRIPE_PRICE_ID", blob)

    def test_blank_annual_var_stays_off(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = "   "
        plans = available_plans()
        self.assertEqual([plan["id"] for plan in plans], ["monthly"])
        self.assertEqual(plans[0]["trial_days"], 0)

    def test_annual_turns_on_family_trial_and_lists_both(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        plans = available_plans()
        self.assertEqual([plan["id"] for plan in plans], ["monthly", "annual"])
        self.assertTrue(all(plan["trial_days"] == 7 for plan in plans))
        self.assertNotIn(PRICE_ANNUAL, json.dumps(plans))

    def test_pro_is_hidden_until_its_price_is_set_and_has_no_trial(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        os.environ["STRIPE_PRICE_ID_PRO"] = PRICE_PRO
        plans = {plan["id"]: plan for plan in available_plans()}
        self.assertEqual(set(plans), {"monthly", "annual", "pro"})
        self.assertEqual(plans["pro"]["trial_days"], 0)
        self.assertEqual(plans["pro"]["amount_display"], "$149")
        self.assertNotIn("license", plans["pro"]["description"].lower())

    def test_public_endpoint_lists_only_configured_plans(self):
        from app.main import public_plans

        self.assertEqual([plan["id"] for plan in public_plans()["plans"]], ["monthly"])
        os.environ["STRIPE_PRICE_ID_PRO"] = PRICE_PRO
        ids = [plan["id"] for plan in public_plans()["plans"]]
        self.assertEqual(ids, ["monthly", "pro"])
        self.assertEqual(public_plans()["plans"][1]["trial_days"], 0)


class CheckoutParamTests(EnvCase):
    def params(self, plan_id: str, user: dict | None = None, prior: bool = False) -> dict:
        newbie = user if user is not None else {
            "subscription_status": "none",
            "trial_used": 0,
            "stripe_subscription_id": None,
        }
        return build_checkout_params(
            "Caregiver@Example.com",
            1,
            "https://app.example/dashboard?subscription=success",
            "https://app.example/access-gate?subscription=canceled",
            plan_id,
            newbie,
            prior,
        )

    def test_monthly_without_annual_matches_todays_checkout(self):
        params = self.params("monthly")
        self.assertEqual(params["mode"], "subscription")
        self.assertEqual(params["payment_method_types"], ["card"])
        self.assertEqual(params["customer_email"], "caregiver@example.com")
        self.assertEqual(params["line_items"], [{"price": PRICE_MONTH, "quantity": 1}])
        self.assertNotIn("payment_method_collection", params)
        self.assertNotIn("trial_period_days", params["subscription_data"])
        self.assertNotIn("trial_settings", params["subscription_data"])

    def test_family_trial_for_first_timer_collects_a_card(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        for plan_id, price in (("monthly", PRICE_MONTH), ("annual", PRICE_ANNUAL)):
            params = self.params(plan_id)
            self.assertEqual(params["line_items"], [{"price": price, "quantity": 1}])
            self.assertEqual(params["payment_method_collection"], "always")
            self.assertEqual(params["subscription_data"]["trial_period_days"], 7)
            self.assertEqual(
                params["subscription_data"]["trial_settings"]["end_behavior"]["missing_payment_method"],
                "cancel",
            )

    def test_pro_never_gets_a_trial(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        os.environ["STRIPE_PRICE_ID_PRO"] = PRICE_PRO
        params = self.params("pro")
        self.assertEqual(params["line_items"], [{"price": PRICE_PRO, "quantity": 1}])
        self.assertNotIn("trial_period_days", params["subscription_data"])
        self.assertNotIn("payment_method_collection", params)

    def test_no_second_trial_after_trial_or_subscription(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        blocked = [
            {"subscription_status": "none", "trial_used": 1, "stripe_subscription_id": None},
            {"subscription_status": "canceled", "trial_used": 0, "stripe_subscription_id": None},
            {"subscription_status": "active", "trial_used": 0, "stripe_subscription_id": "sub_old"},
            {"subscription_status": "past_due", "trial_used": 0, "stripe_subscription_id": None},
            {"subscription_status": "none", "trial_used": 0, "stripe_subscription_id": "sub_old"},
        ]
        for user in blocked:
            params = self.params("annual", user=user)
            self.assertNotIn("trial_period_days", params["subscription_data"], user)
        prior = self.params("monthly", prior=True)
        self.assertNotIn("trial_period_days", prior["subscription_data"])

    def test_unknown_plan_is_rejected_before_stripe(self):
        with self.assertRaises(ValueError):
            self.params("all_access")

    def test_create_session_uses_db_row_and_does_not_trial_a_returning_user(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        user_id = self.insert_user(trial_used=1, subscription_status="canceled")
        with patch("app.stripe_billing.email_has_any_subscription", return_value=False), patch(
            "app.stripe_billing.stripe.checkout.Session.create",
            return_value=SimpleNamespace(url="https://checkout.test/c"),
        ) as create:
            url = create_checkout_session(
                "caregiver@example.com", user_id, "https://ok", "https://cancel", plan_id="annual"
            )
        self.assertEqual(url, "https://checkout.test/c")
        sent = create.call_args.kwargs
        self.assertEqual(sent["line_items"], [{"price": PRICE_ANNUAL, "quantity": 1}])
        self.assertNotIn("trial_period_days", sent["subscription_data"])

    def test_create_session_trials_a_first_timer_and_skips_stripe_history_errors(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        user_id = self.insert_user()
        with patch(
            "app.stripe_billing.email_has_any_subscription",
            side_effect=RuntimeError("stripe down"),
        ), patch(
            "app.stripe_billing.stripe.checkout.Session.create",
            return_value=SimpleNamespace(url="https://checkout.test/new"),
        ) as create:
            create_checkout_session(
                "caregiver@example.com", user_id, "https://ok", "https://cancel", plan_id="Monthly"
            )
        sent = create.call_args.kwargs
        self.assertEqual(sent["line_items"][0]["price"], PRICE_MONTH)
        self.assertEqual(sent["subscription_data"]["trial_period_days"], 7)
        self.assertEqual(sent["payment_method_collection"], "always")

    def test_stripe_history_blocks_a_trial_even_when_our_row_is_new(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        user_id = self.insert_user(email="returning@example.com")
        with patch("app.stripe_billing.email_has_any_subscription", return_value=True), patch(
            "app.stripe_billing.stripe.checkout.Session.create",
            return_value=SimpleNamespace(url="https://checkout.test/back"),
        ) as create:
            create_checkout_session(
                "returning@example.com", user_id, "https://ok", "https://cancel", plan_id="monthly"
            )
        self.assertNotIn("trial_period_days", create.call_args.kwargs["subscription_data"])

    def test_unavailable_pro_does_not_open_checkout(self):
        user_id = self.insert_user()
        with patch("app.stripe_billing.stripe.checkout.Session.create") as create:
            with self.assertRaises(ValueError):
                create_checkout_session(
                    "caregiver@example.com", user_id, "https://ok", "https://cancel", plan_id="pro"
                )
        create.assert_not_called()


class SubscriptionRecordTests(EnvCase):
    def test_webhook_sets_plan_from_price_and_is_idempotent(self):
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        self.insert_user()
        payload = subscription_payload(PRICE_ANNUAL, status="trialing", trial_end=1893456000)
        _handle_subscription_upsert(payload)
        _handle_subscription_upsert(payload)
        status = get_user_subscription_status(1)
        self.assertEqual(status["status"], "trialing")
        self.assertTrue(status["has_access"])
        self.assertEqual(status["plan"], "annual")
        self.assertEqual(status["plan_label"], "Annual")
        self.assertTrue(status["trial_used"])
        self.assertIsNotNone(status["trial_ends_at"])

    def test_portal_plan_change_updates_plan_and_unknown_price_does_not_wipe_it(self):
        self.insert_user()
        _handle_subscription_upsert(subscription_payload(PRICE_MONTH, status="active"))
        self.assertEqual(get_user_subscription_status(1)["plan"], "monthly")
        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        switched = subscription_payload(PRICE_ANNUAL, status="active")
        _handle_subscription_upsert(switched)
        self.assertEqual(get_user_subscription_status(1)["plan"], "annual")
        unknown = subscription_payload("price_unknown", status="active")
        _handle_subscription_upsert(unknown)
        self.assertEqual(get_user_subscription_status(1)["plan"], "annual")

    def test_delete_keeps_plan_and_marks_trial_used(self):
        self.insert_user()
        _handle_subscription_upsert(subscription_payload(PRICE_MONTH, status="active"))
        _handle_subscription_deleted({"id": "sub_1", "customer": "cus_1"})
        status = get_user_subscription_status(1)
        self.assertEqual(status["status"], "canceled")
        self.assertFalse(status["has_access"])
        self.assertEqual(status["plan"], "monthly")
        self.assertTrue(status["trial_used"])

    def test_checkout_completed_uses_subscription_price_and_trial(self):
        self.insert_user()
        session = {
            "customer_email": "caregiver@example.com",
            "customer": "cus_1",
            "metadata": {"user_id": "1"},
            "subscription": subscription_payload(PRICE_MONTH, status="trialing", trial_end=1893456000),
        }
        _handle_checkout_completed(session)
        status = get_user_subscription_status(1)
        self.assertEqual(status["status"], "trialing")
        self.assertEqual(status["plan"], "monthly")
        self.assertTrue(status["has_access"])

    def test_checkout_completed_does_not_clobber_trial_when_stripe_cannot_be_read(self):
        self.insert_user()
        _handle_subscription_upsert(subscription_payload(PRICE_MONTH, status="trialing", trial_end=1893456000))
        with patch("app.stripe_billing.stripe.Subscription.retrieve", side_effect=RuntimeError("down")):
            _handle_checkout_completed({
                "customer_email": "caregiver@example.com",
                "customer": "cus_1",
                "metadata": {"user_id": "1"},
                "subscription": "sub_1",
            })
        self.assertEqual(get_user_subscription_status(1)["status"], "trialing")

    def test_confirm_grants_trial_access_from_the_stripe_price(self):
        os.environ["STRIPE_PRICE_ID_PRO"] = PRICE_PRO
        self.insert_user()
        session = {
            "id": "cs_1",
            "status": "complete",
            "payment_status": "no_payment_required",
            "customer": "cus_1",
            "customer_email": "caregiver@example.com",
            "metadata": {"user_id": "1"},
            "subscription": subscription_payload(PRICE_PRO, status="active"),
        }
        with patch(
            "app.stripe_billing.stripe.checkout.Session.retrieve",
            return_value=StripeObj(session),
        ):
            status = confirm_checkout_session("cs_1", 1, "caregiver@example.com")
        self.assertEqual(status["plan"], "pro")
        self.assertEqual(status["status"], "active")
        self.assertTrue(status["has_access"])
        self.assertTrue(status["trial_used"])

        with patch(
            "app.stripe_billing.stripe.checkout.Session.retrieve",
            return_value=StripeObj(session),
        ):
            again = confirm_checkout_session("cs_1", 1, "caregiver@example.com")
        self.assertEqual(again["plan"], "pro")

    def test_confirm_rejects_someone_elses_session_and_ignores_unpaid(self):
        self.insert_user()
        other = {
            "status": "complete",
            "payment_status": "paid",
            "customer_email": "other@example.com",
            "metadata": {"user_id": "99"},
            "subscription": subscription_payload(PRICE_MONTH),
        }
        with patch(
            "app.stripe_billing.stripe.checkout.Session.retrieve",
            return_value=StripeObj(other),
        ):
            with self.assertRaises(ValueError):
                confirm_checkout_session("cs_other", 1, "caregiver@example.com")

        unpaid = {
            "status": "open",
            "payment_status": "unpaid",
            "customer_email": "caregiver@example.com",
            "metadata": {"user_id": "1"},
        }
        with patch(
            "app.stripe_billing.stripe.checkout.Session.retrieve",
            return_value=StripeObj(unpaid),
        ):
            status = confirm_checkout_session("cs_open", 1, "caregiver@example.com")
        self.assertEqual(status["status"], "none")
        self.assertFalse(status["has_access"])

    def test_remember_plan_fills_a_missing_plan_without_changing_status(self):
        self.insert_user(subscription_status="active", stripe_subscription_id="sub_1", stripe_customer_id="cus_1")
        payload = subscription_payload(PRICE_MONTH, status="trialing", trial_end=1893456000)
        with patch(
            "app.stripe_billing.stripe.Subscription.retrieve",
            return_value=StripeObj(payload),
        ) as retrieve:
            status = remember_plan_from_stripe(1)
        retrieve.assert_called_once()
        self.assertEqual(status["status"], "active")
        self.assertEqual(status["plan"], "monthly")
        self.assertIsNotNone(status["trial_ends_at"])

    def test_active_subscriber_is_not_sent_through_checkout(self):
        from app.main import CheckoutRequest, checkout

        with patch("app.main.reconcile_subscription_from_stripe", return_value={"has_access": True}), patch(
            "app.main.create_checkout_session"
        ) as create:
            result = checkout(
                CheckoutRequest(success_url="https://ok", cancel_url="https://cancel", plan="annual"),
                {"sub": "1", "email": "caregiver@example.com"},
            )
        self.assertTrue(result["already_subscribed"])
        self.assertIsNone(result["checkout_url"])
        create.assert_not_called()


class MigrationTests(unittest.TestCase):
    def test_fresh_database_has_plan_columns(self):
        data_dir = tempfile.mkdtemp(prefix="thha-fresh-")
        os.environ["DATA_DIR"] = data_dir
        init_db()
        with get_db() as conn:
            cols = {row[1] for row in conn.execute("PRAGMA table_info(users)")}
        self.assertIn("subscription_plan", cols)
        self.assertIn("subscription_trial_ends_at", cols)
        self.assertIn("trial_used", cols)

    def test_existing_table_gains_columns_without_dropping_rows(self):
        conn = sqlite3.connect(":memory:")
        conn.execute(
            """CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                name TEXT,
                email TEXT
            )"""
        )
        conn.execute("INSERT INTO users (name, email) VALUES ('Existing', 'existing@example.com')")
        _migrate_add_columns(conn)
        cols = {row[1] for row in conn.execute("PRAGMA table_info(users)")}
        self.assertIn("subscription_plan", cols)
        self.assertIn("subscription_trial_ends_at", cols)
        self.assertIn("trial_used", cols)
        row = conn.execute("SELECT name, email, trial_used FROM users").fetchone()
        self.assertEqual(row[0], "Existing")
        self.assertEqual(row[1], "existing@example.com")
        self.assertEqual(row[2], 0)
        conn.close()


class WebhookIdempotencyTests(EnvCase):
    def test_duplicate_event_is_stored_once_and_plan_stays_correct(self):
        import asyncio

        from starlette.requests import Request

        from app.main import public_plans, stripe_webhook

        os.environ["STRIPE_PRICE_ID_ANNUAL"] = PRICE_ANNUAL
        self.insert_user()
        self.assertEqual(
            [plan["id"] for plan in public_plans()["plans"]],
            ["monthly", "annual"],
        )
        event = {
            "id": "evt_plan_1",
            "type": "customer.subscription.updated",
            "data": {
                "object": subscription_payload(PRICE_ANNUAL, status="trialing", trial_end=1893456000)
            },
        }
        raw = json.dumps(event).encode()

        def post_once():
            calls = {"n": 0}

            async def receive():
                calls["n"] += 1
                if calls["n"] == 1:
                    return {"type": "http.request", "body": raw, "more_body": False}
                return {"type": "http.disconnect"}

            scope = {
                "type": "http",
                "asgi": {"version": "3.0"},
                "http_version": "1.1",
                "method": "POST",
                "scheme": "http",
                "path": "/api/webhooks/stripe",
                "raw_path": b"/api/webhooks/stripe",
                "query_string": b"",
                "headers": [(b"stripe-signature", b"t=1,v1=test")],
                "client": ("127.0.0.1", 123),
                "server": ("test", 80),
            }
            return asyncio.run(stripe_webhook(Request(scope, receive)))

        with patch("app.stripe_billing.stripe.Webhook.construct_event", return_value=True):
            first = post_once()
            second = post_once()
        self.assertEqual(first["event_type"], "customer.subscription.updated")
        self.assertEqual(second["event_type"], "customer.subscription.updated")
        with get_db() as conn:
            count = conn.execute(
                "SELECT COUNT(*) FROM webhook_events WHERE event_id = 'evt_plan_1'"
            ).fetchone()[0]
        self.assertEqual(count, 1)
        status = get_user_subscription_status(1)
        self.assertEqual(status["plan"], "annual")
        self.assertEqual(status["status"], "trialing")


if __name__ == "__main__":
    unittest.main()
