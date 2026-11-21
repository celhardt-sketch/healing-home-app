"""
Stripe subscription billing module.
Handles checkout session creation, webhook processing, and billing portal.
Card data never touches our server — all handled by Stripe hosted checkout.
"""

import json
import os
from datetime import datetime, timezone

import stripe

from .database import get_db


def _as_dict(stripe_obj) -> dict:
    """Convert a StripeObject to a plain nested dict.

    StripeObject is not a dict subclass in stripe-python v15, so calling .get() on
    values returned by the API (retrieve/modify/list) raises AttributeError. Round
    tripping through its JSON serialization yields plain, nested dicts.
    """
    return json.loads(str(stripe_obj))


def get_stripe_secret_key() -> str:
    key = os.environ.get("STRIPE_SECRET_KEY")
    if not key:
        raise RuntimeError("STRIPE_SECRET_KEY environment variable is not set.")
    return key


def get_stripe_webhook_secret() -> str:
    secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
    if not secret:
        raise RuntimeError("STRIPE_WEBHOOK_SECRET environment variable is not set.")
    return secret


def get_stripe_price_id() -> str:
    price_id = _env_price("STRIPE_PRICE_ID")
    if not price_id:
        raise RuntimeError("STRIPE_PRICE_ID environment variable is not set.")
    return price_id


def _env_price(name: str) -> str:
    return (os.environ.get(name) or "").strip()


# Display copy for plans checkout can sell. Price IDs come only from env vars.
# A future plan (for example All Access) is another entry here plus its own env var.
FAMILY_TRIAL_DAYS = 7
PLAN_CATALOG = [
    {
        "id": "monthly",
        "env": "STRIPE_PRICE_ID",
        "name": "Monthly",
        "group": "family",
        "amount_display": "$9.99",
        "interval": "month",
        "trial_days": FAMILY_TRIAL_DAYS,
        "description": "Full access for your family, billed each month. Cancel anytime.",
    },
    {
        "id": "annual",
        "env": "STRIPE_PRICE_ID_ANNUAL",
        "name": "Annual",
        "group": "family",
        "amount_display": "$99",
        "interval": "year",
        "trial_days": FAMILY_TRIAL_DAYS,
        "description": "Full access for your family, billed once a year.",
    },
    {
        "id": "pro",
        "env": "STRIPE_PRICE_ID_PRO",
        "name": "Professional",
        "group": "professional",
        "amount_display": "$149",
        "interval": "year",
        "trial_days": 0,
        "description": (
            "For therapists, caseworkers, and teachers. "
            "The same app access as the family plans, billed once a year."
        ),
    },
]
_PUBLIC_PLAN_KEYS = ("id", "name", "group", "amount_display", "interval", "description")
# Statuses that mean this person has already held a subscription, so no second trial.
_SUBSCRIBED_STATUSES = {"active", "trialing", "past_due", "canceled", "unpaid", "paused"}
# Checkout can create an incomplete subscription before payment. That is not a trial or a subscription.
_IGNORED_SUBSCRIPTION_STATUSES = {"incomplete", "incomplete_expired"}


def _plan_spec(plan_id: str) -> dict:
    for spec in PLAN_CATALOG:
        if spec["id"] == plan_id:
            return spec
    raise ValueError("That plan is not available.")


def family_trial_enabled() -> bool:
    """Keep today's checkout unchanged until the annual price is configured.

    A deploy with only STRIPE_PRICE_ID must look and bill exactly as it does now.
    Setting STRIPE_PRICE_ID_ANNUAL turns the 7-day trial on for every family plan.
    The professional plan never has a trial.
    """
    return bool(_env_price("STRIPE_PRICE_ID_ANNUAL"))


def offered_trial_days(plan_id: str) -> int:
    spec = _plan_spec(plan_id)
    if spec["trial_days"] <= 0 or not family_trial_enabled():
        return 0
    return int(spec["trial_days"])


def resolve_price_id(plan_id: str) -> str:
    spec = _plan_spec(plan_id)
    price_id = _env_price(spec["env"])
    if price_id:
        return price_id
    if spec["id"] == "monthly":
        raise RuntimeError("STRIPE_PRICE_ID environment variable is not set.")
    raise ValueError(f"The {spec['name']} plan is not available.")


def plan_for_price_id(price_id: str | None) -> str | None:
    """Map a Stripe price id back to a plan key. Unknown prices return None."""
    if not price_id:
        return None
    price_id = price_id.strip()
    for spec in PLAN_CATALOG:
        if _env_price(spec["env"]) == price_id:
            return spec["id"]
    return None


def plan_label(plan_id: str | None) -> str | None:
    if not plan_id:
        return None
    for spec in PLAN_CATALOG:
        if spec["id"] == plan_id:
            return spec["name"]
    return None


def available_plans() -> list[dict]:
    """Plans whose price env var is set. Never includes Stripe price IDs."""
    plans = []
    for spec in PLAN_CATALOG:
        if not _env_price(spec["env"]):
            continue
        plan = {key: spec[key] for key in _PUBLIC_PLAN_KEYS}
        plan["trial_days"] = offered_trial_days(spec["id"])
        plans.append(plan)
    return plans


def user_can_start_trial(user: dict | None, plan_id: str, prior_subscription: bool) -> bool:
    """One trial ever, and only on a family plan, for someone who has never subscribed."""
    if offered_trial_days(plan_id) <= 0:
        return False
    if prior_subscription or not user:
        return False
    if user.get("trial_used"):
        return False
    if user.get("stripe_subscription_id"):
        return False
    status = (user.get("subscription_status") or "none").strip().lower()
    if status not in ("", "none"):
        return False
    return True


def build_checkout_params(
    user_email: str,
    user_id: int,
    success_url: str,
    cancel_url: str,
    plan_id: str,
    user: dict | None,
    prior_subscription: bool,
) -> dict:
    """Arguments for Checkout Session.create. Testable without calling Stripe."""
    price_id = resolve_price_id(plan_id)
    params = {
        "mode": "subscription",
        "payment_method_types": ["card"],
        "customer_email": user_email.strip().lower(),
        "line_items": [{"price": price_id, "quantity": 1}],
        "success_url": success_url,
        "cancel_url": cancel_url,
        "metadata": {"user_id": str(user_id), "plan": plan_id},
        "subscription_data": {"metadata": {"user_id": str(user_id), "plan": plan_id}},
    }
    if user_can_start_trial(user, plan_id, prior_subscription):
        # Default collection is already "always"; set it so a $0 trial still takes a card.
        params["payment_method_collection"] = "always"
        params["subscription_data"]["trial_period_days"] = offered_trial_days(plan_id)
        params["subscription_data"]["trial_settings"] = {
            "end_behavior": {"missing_payment_method": "cancel"}
        }
    return params


def init_stripe() -> None:
    stripe.api_key = get_stripe_secret_key()


def _load_user_billing(user_id: int) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            """SELECT id, email, subscription_status, stripe_customer_id,
                      stripe_subscription_id, trial_used, subscription_plan
               FROM users WHERE id = ?""",
            (user_id,),
        ).fetchone()
    return dict(row) if row else None


def email_has_any_subscription(email: str) -> bool:
    """True when Stripe already has a real subscription for this email.

    Catches a second account, or a missed webhook, so a person cannot start another trial.
    Incomplete checkouts do not count.
    """
    init_stripe()
    email = (email or "").strip().lower()
    if not email:
        return False
    customers = stripe.Customer.list(email=email, limit=20)
    for customer in customers.auto_paging_iter():
        customer_id = customer["id"]
        subs = stripe.Subscription.list(customer=customer_id, status="all", limit=20)
        for sub in subs.auto_paging_iter():
            record = sub if isinstance(sub, dict) else _as_dict(sub)
            status = record.get("status") or ""
            if status not in _IGNORED_SUBSCRIPTION_STATUSES:
                return True
    return False


def create_checkout_session(
    user_email: str,
    user_id: int,
    success_url: str,
    cancel_url: str,
    plan_id: str | None = None,
) -> str:
    """Create a Stripe Checkout session for a subscription. Returns the checkout URL."""
    init_stripe()
    chosen = (plan_id or "monthly").strip().lower()
    user = _load_user_billing(user_id)
    prior = False
    try:
        prior = email_has_any_subscription(user_email)
    except Exception:
        # A Stripe lookup failure must not block checkout. Local trial flags still apply.
        prior = False
    params = build_checkout_params(
        user_email, user_id, success_url, cancel_url, chosen, user, prior
    )
    session = stripe.checkout.Session.create(**params)
    return session.url


def create_billing_portal_session(customer_id: str, return_url: str) -> str:
    """Create a Stripe Billing Portal session. Returns the portal URL."""
    init_stripe()
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url,
    )
    return session.url


def handle_webhook_event(payload: bytes, sig_header: str) -> dict:
    """
    Process Stripe webhook events.
    Handles: checkout.session.completed, customer.subscription.updated,
    customer.subscription.deleted, invoice.payment_failed
    """
    init_stripe()
    webhook_secret = get_stripe_webhook_secret()

    try:
        # Verify the signature; the returned StripeObject is not a dict subclass in
        # stripe-python v15, so we read the event from the raw JSON payload below to
        # give every handler plain dicts that support .get().
        stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except stripe.error.SignatureVerificationError:
        raise ValueError("Invalid webhook signature")
    except Exception as e:
        raise ValueError(f"Webhook error: {str(e)}")

    event = json.loads(payload)
    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        _handle_checkout_completed(data)
    elif event_type in ("customer.subscription.created", "customer.subscription.updated"):
        _handle_subscription_upsert(data)
    elif event_type == "customer.subscription.deleted":
        _handle_subscription_deleted(data)
    elif event_type == "invoice.payment_failed":
        _handle_payment_failed(data)

    return {"event_type": event_type, "handled": True}


def _price_id_from_item(item: dict) -> str | None:
    price = item.get("price")
    if isinstance(price, str) and price:
        return price
    if isinstance(price, dict) and price.get("id"):
        return price["id"]
    plan = item.get("plan")
    if isinstance(plan, str) and plan:
        return plan
    if isinstance(plan, dict) and plan.get("id"):
        return plan["id"]
    return None


def _price_id_from_subscription(subscription: dict) -> str | None:
    """Prefer a price this server knows, so an extra line item cannot hide the plan."""
    items = (subscription.get("items") or {}).get("data") or []
    ids = [pid for pid in (_price_id_from_item(item or {}) for item in items) if pid]
    if not ids:
        return None
    for price_id in ids:
        if plan_for_price_id(price_id):
            return price_id
    return ids[0]


def _trial_end_iso(subscription: dict) -> str | None:
    ts = subscription.get("trial_end")
    if not ts:
        items = (subscription.get("items") or {}).get("data") or []
        for item in items:
            current = (item or {}).get("current_trial") or {}
            if isinstance(current, dict) and current.get("end_date"):
                ts = current["end_date"]
                break
    if not ts:
        return None
    return datetime.fromtimestamp(int(ts), tz=timezone.utc).isoformat()


def _subscription_updates(subscription: dict) -> dict:
    trial_ends = _trial_end_iso(subscription)
    status = subscription.get("status")
    mark_trial_used = 1 if trial_ends or status in _SUBSCRIBED_STATUSES else 0
    return {
        "status": status,
        "plan": plan_for_price_id(_price_id_from_subscription(subscription)),
        "trial_ends_at": trial_ends,
        "mark_trial_used": mark_trial_used,
        "cancel_at_period_end": 1 if subscription.get("cancel_at_period_end") else 0,
        "ends_at": _period_end_iso(subscription),
        "subscription_id": subscription.get("id"),
        "customer_id": subscription.get("customer"),
    }


def _persist_subscription(
    subscription: dict,
    customer_id: str | None,
    match: str,
    user_id: int | None = None,
    email: str | None = None,
) -> None:
    """Write plan, trial end, and status taken from the Stripe subscription object."""
    fields = _subscription_updates(subscription)
    now = datetime.now(timezone.utc).isoformat()
    set_sql = """
        stripe_customer_id = COALESCE(?, stripe_customer_id),
        stripe_subscription_id = COALESCE(?, stripe_subscription_id),
        subscription_status = ?,
        subscription_plan = CASE WHEN ? IS NOT NULL THEN ? ELSE subscription_plan END,
        subscription_trial_ends_at = ?,
        trial_used = CASE WHEN COALESCE(trial_used, 0) = 1 OR ? = 1 THEN 1 ELSE 0 END,
        subscription_cancel_at_period_end = ?,
        subscription_ends_at = ?,
        subscription_updated_at = ?
    """
    params_head = (
        customer_id or fields["customer_id"],
        fields["subscription_id"],
        fields["status"],
        fields["plan"],
        fields["plan"],
        fields["trial_ends_at"],
        fields["mark_trial_used"],
        fields["cancel_at_period_end"],
        fields["ends_at"],
        now,
    )
    if match == "user":
        where = "id = ?"
        params_tail = (user_id,)
    elif match == "checkout":
        where = "email = ? OR id = ?"
        params_tail = (email, int(user_id) if user_id else -1)
    elif match == "subscription":
        where = "id = ? OR stripe_customer_id = ? OR stripe_subscription_id = ?"
        params_tail = (
            int(user_id) if user_id else -1,
            customer_id or fields["customer_id"],
            fields["subscription_id"],
        )
    else:
        raise ValueError("unknown subscription match")

    with get_db() as conn:
        conn.execute(
            f"UPDATE users SET {set_sql} WHERE {where}",
            params_head + params_tail,
        )
        conn.commit()


def _subscription_from_checkout_session(session: dict) -> tuple[str | None, dict | None]:
    """Return (subscription id, subscription dict) from a checkout session.

    The webhook usually carries only the id. Confirm may expand the subscription.
    """
    ref = session.get("subscription")
    if isinstance(ref, dict):
        return ref.get("id"), ref
    if not ref:
        return None, None
    try:
        return ref, _as_dict(stripe.Subscription.retrieve(ref))
    except Exception:
        return ref, None


def _handle_checkout_completed(session: dict) -> None:
    """Grant access after successful checkout, using the Stripe price as the plan."""
    customer_email = session.get("customer_email") or session.get("customer_details", {}).get("email")
    customer_id = session.get("customer")
    user_id = (session.get("metadata") or {}).get("user_id")

    if not customer_email:
        return

    subscription_id, subscription = _subscription_from_checkout_session(session)
    if subscription:
        _persist_subscription(
            subscription,
            customer_id,
            "checkout",
            user_id=int(user_id) if user_id else None,
            email=customer_email,
        )
        return

    with get_db() as conn:
        # Same grant as before when Stripe cannot be read. Do not clobber a trial
        # status that customer.subscription.created already recorded.
        conn.execute(
            """UPDATE users
               SET stripe_customer_id = ?,
                   stripe_subscription_id = ?,
                   subscription_status = CASE
                       WHEN subscription_status IN ('trialing', 'active', 'past_due')
                       THEN subscription_status
                       ELSE 'active'
                   END,
                   subscription_updated_at = ?
               WHERE email = ? OR id = ?""",
            (customer_id, subscription_id, datetime.now(timezone.utc).isoformat(),
             customer_email, int(user_id) if user_id else -1),
        )
        conn.commit()


def _handle_subscription_upsert(subscription: dict) -> None:
    """Create or update a user's subscription status (active, past_due, canceled, etc.).

    Handles both customer.subscription.created and .updated. A brand-new subscriber
    has no stripe_customer_id stored yet, so matching only on customer/subscription id
    would miss them; we link by the user_id stamped on the subscription metadata at
    checkout, which also persists the Stripe ids for future events.

    The plan is taken from the subscription's Stripe price, so a change made in the
    billing portal (or a trial converting to paid) updates the account.
    """
    user_id = (subscription.get("metadata") or {}).get("user_id")
    _persist_subscription(
        subscription,
        subscription.get("customer"),
        "subscription",
        user_id=int(user_id) if user_id else None,
    )


def _period_end_iso(subscription: dict) -> str | None:
    """Resolve when the current access period ends, as ISO, if determinable.

    When a membership is scheduled to cancel, Stripe sets a top-level ``cancel_at``
    (the exact date access ends); prefer it so the cancellation date always shows.
    Otherwise use ``current_period_end`` (the renewal date). Newer Stripe API versions
    moved ``current_period_end`` off the subscription and onto each subscription item,
    so fall back to the first item when the top-level field is absent."""
    ts = subscription.get("cancel_at") or subscription.get("current_period_end")
    if not ts:
        items = (subscription.get("items") or {}).get("data") or []
        if items:
            ts = items[0].get("current_period_end")
    if not ts:
        return None
    return datetime.fromtimestamp(int(ts), tz=timezone.utc).isoformat()


def _handle_subscription_deleted(subscription: dict) -> None:
    """Revoke access when subscription is fully canceled."""
    subscription_id = subscription.get("id")
    customer_id = subscription.get("customer")

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET subscription_status = 'canceled',
                   subscription_cancel_at_period_end = 0,
                   subscription_ends_at = NULL,
                   trial_used = 1,
                   subscription_updated_at = ?
               WHERE stripe_customer_id = ? OR stripe_subscription_id = ?""",
            (datetime.now(timezone.utc).isoformat(), customer_id, subscription_id),
        )
        conn.commit()


def _handle_payment_failed(invoice: dict) -> None:
    """Mark subscription as past_due on payment failure."""
    customer_id = invoice.get("customer")
    subscription_id = invoice.get("subscription")

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET subscription_status = 'past_due',
                   trial_used = 1,
                   subscription_updated_at = ?
               WHERE stripe_customer_id = ? OR stripe_subscription_id = ?""",
            (datetime.now(timezone.utc).isoformat(), customer_id, subscription_id),
        )
        conn.commit()


def confirm_checkout_session(session_id: str, user_id: int, user_email: str) -> dict:
    """
    Verify a completed Checkout Session directly with Stripe and grant access.

    This does not depend on the asynchronous webhook: after the user returns from
    hosted checkout we retrieve the session, confirm it is paid and belongs to this
    user, and activate their subscription immediately. Idempotent with the webhook.
    """
    init_stripe()

    try:
        session = _as_dict(
            stripe.checkout.Session.retrieve(session_id, expand=["subscription"])
        )
    except Exception:
        session = _as_dict(stripe.checkout.Session.retrieve(session_id))

    metadata_user_id = (session.get("metadata") or {}).get("user_id")
    session_email = session.get("customer_email") or (session.get("customer_details") or {}).get("email")

    owns_session = (
        (metadata_user_id and str(metadata_user_id) == str(user_id))
        or (session_email and user_email and session_email.lower() == user_email.lower())
    )
    if not owns_session:
        raise ValueError("Checkout session does not belong to the current user.")

    paid = session.get("payment_status") == "paid" or session.get("status") == "complete"
    if not paid:
        # Not paid yet — leave status unchanged so the caller can retry/poll.
        return get_user_subscription_status(user_id)

    customer_id = session.get("customer")
    subscription_id, subscription = _subscription_from_checkout_session(session)
    if subscription:
        _persist_subscription(subscription, customer_id, "user", user_id=user_id)
        return get_user_subscription_status(user_id)

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET stripe_customer_id = COALESCE(?, stripe_customer_id),
                   stripe_subscription_id = COALESCE(?, stripe_subscription_id),
                   subscription_status = CASE
                       WHEN subscription_status IN ('trialing', 'active', 'past_due')
                       THEN subscription_status
                       ELSE 'active'
                   END,
                   subscription_updated_at = ?
               WHERE id = ?""",
            (customer_id, subscription_id, datetime.now(timezone.utc).isoformat(), user_id),
        )
        conn.commit()

    return get_user_subscription_status(user_id)


def cancel_subscription(user_id: int) -> dict:
    """Cancel the user's subscription at the end of the current billing period.

    Access is retained until the paid period ends (cancel_at_period_end), which is
    the expected behavior for a paid membership.
    """
    init_stripe()
    with get_db() as conn:
        user = conn.execute(
            "SELECT stripe_subscription_id FROM users WHERE id = ?", (user_id,)
        ).fetchone()

    subscription_id = user["stripe_subscription_id"] if user else None
    if not subscription_id:
        raise ValueError("No active membership to cancel.")

    subscription = _as_dict(stripe.Subscription.modify(subscription_id, cancel_at_period_end=True))
    ends_at = _period_end_iso(subscription)

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET subscription_cancel_at_period_end = 1,
                   subscription_ends_at = ?,
                   subscription_updated_at = ?
               WHERE id = ?""",
            (ends_at, datetime.now(timezone.utc).isoformat(), user_id),
        )
        conn.commit()

    return get_user_subscription_status(user_id)


def resume_subscription(user_id: int) -> dict:
    """Undo a scheduled cancellation so the membership renews as normal."""
    init_stripe()
    with get_db() as conn:
        user = conn.execute(
            "SELECT stripe_subscription_id FROM users WHERE id = ?", (user_id,)
        ).fetchone()

    subscription_id = user["stripe_subscription_id"] if user else None
    if not subscription_id:
        raise ValueError("No membership to resume.")

    stripe.Subscription.modify(subscription_id, cancel_at_period_end=False)

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET subscription_cancel_at_period_end = 0,
                   subscription_updated_at = ?
               WHERE id = ?""",
            (datetime.now(timezone.utc).isoformat(), user_id),
        )
        conn.commit()

    return get_user_subscription_status(user_id)


# Stripe subscription statuses that mean the customer is (or will be) billed and
# therefore must not be sent through checkout again.
_LIVE_STRIPE_STATUSES = {"active", "trialing", "past_due"}


def find_live_subscription_for_email(email: str):
    """Return (customer_id, subscription) for any live Stripe subscription owned by
    this email, or (None, None). Used to reconcile our DB with Stripe directly so a
    paid user is never bounced (and never charged twice) when a webhook is missed."""
    init_stripe()
    email = (email or "").strip().lower()
    for customer in stripe.Customer.list(email=email, limit=20).auto_paging_iter():
        customer_id = customer["id"]
        for sub in stripe.Subscription.list(
            customer=customer_id, status="all", limit=20
        ).auto_paging_iter():
            # StripeObject is not a dict subclass in v15; convert so .get() works.
            sub = _as_dict(sub)
            if sub.get("status") in _LIVE_STRIPE_STATUSES:
                return customer_id, sub
    return None, None


def reconcile_subscription_from_stripe(user_id: int, email: str) -> dict:
    """Self-heal: if Stripe shows a live subscription for this user but our DB does
    not, activate the account. Safe no-op when Stripe has nothing live. Returns the
    resulting subscription status dict."""
    customer_id, sub = find_live_subscription_for_email(email)
    if not sub:
        return get_user_subscription_status(user_id)

    _persist_subscription(sub, customer_id, "user", user_id=user_id)
    return get_user_subscription_status(user_id)


# Users whose Stripe price we already looked up and could not map. Avoids calling
# Stripe on every status check when the price is not one of the configured plans.
_unmapped_plan_sync: set[int] = set()


def remember_plan_from_stripe(user_id: int) -> dict:
    """Fill in a missing plan from the stored Stripe subscription, without changing access.

    Existing subscribers get a plan name on their next visit. A Stripe error leaves
    the current status untouched.
    """
    status = get_user_subscription_status(user_id)
    if status.get("plan") or status.get("is_admin") or user_id in _unmapped_plan_sync:
        return status
    with get_db() as conn:
        row = conn.execute(
            "SELECT stripe_subscription_id, stripe_customer_id FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()
    if not row or not row["stripe_subscription_id"]:
        return status
    try:
        init_stripe()
        sub = _as_dict(stripe.Subscription.retrieve(row["stripe_subscription_id"]))
    except Exception:
        return status
    fields = _subscription_updates(sub)
    if not fields["plan"]:
        _unmapped_plan_sync.add(user_id)
        return status
    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET subscription_plan = ?,
                   subscription_trial_ends_at = COALESCE(?, subscription_trial_ends_at),
                   trial_used = CASE WHEN COALESCE(trial_used, 0) = 1 OR ? = 1 THEN 1 ELSE 0 END
               WHERE id = ?""",
            (fields["plan"], fields["trial_ends_at"], fields["mark_trial_used"], user_id),
        )
        conn.commit()
    return get_user_subscription_status(user_id)


def get_user_subscription_status(user_id: int) -> dict:
    """Get the subscription status for a user."""
    with get_db() as conn:
        user = conn.execute(
            """SELECT subscription_status, stripe_customer_id, is_admin,
                      subscription_cancel_at_period_end, subscription_ends_at,
                      subscription_plan, subscription_trial_ends_at, trial_used
               FROM users WHERE id = ?""",
            (user_id,),
        ).fetchone()

    if not user:
        return {
            "status": "none",
            "has_access": False,
            "is_admin": False,
            "cancel_at_period_end": False,
            "ends_at": None,
            "plan": None,
            "plan_label": None,
            "trial_ends_at": None,
            "trial_used": False,
        }

    status = user["subscription_status"] or "none"
    is_admin = bool(user["is_admin"])
    # Admins always have full access and are never billed.
    has_access = is_admin or status in ("active", "trialing")
    plan = user["subscription_plan"]
    label = plan_label(plan)
    if plan and not label:
        label = "Membership"

    return {
        "status": status,
        "has_access": has_access,
        "is_admin": is_admin,
        "stripe_customer_id": user["stripe_customer_id"],
        "cancel_at_period_end": bool(user["subscription_cancel_at_period_end"]),
        "ends_at": user["subscription_ends_at"],
        "plan": plan,
        "plan_label": label,
        "trial_ends_at": user["subscription_trial_ends_at"],
        "trial_used": bool(user["trial_used"]),
    }
