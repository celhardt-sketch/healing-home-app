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
    price_id = os.environ.get("STRIPE_PRICE_ID")
    if not price_id:
        raise RuntimeError("STRIPE_PRICE_ID environment variable is not set.")
    return price_id


def init_stripe() -> None:
    stripe.api_key = get_stripe_secret_key()


def create_checkout_session(user_email: str, user_id: int, success_url: str, cancel_url: str) -> str:
    """Create a Stripe Checkout session for a subscription. Returns the checkout URL."""
    init_stripe()
    price_id = get_stripe_price_id()

    session = stripe.checkout.Session.create(
        mode="subscription",
        payment_method_types=["card"],
        customer_email=user_email,
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"user_id": str(user_id)},
        subscription_data={"metadata": {"user_id": str(user_id)}},
    )
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


def _handle_checkout_completed(session: dict) -> None:
    """Grant access after successful checkout."""
    customer_email = session.get("customer_email") or session.get("customer_details", {}).get("email")
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")
    user_id = session.get("metadata", {}).get("user_id")

    if not customer_email:
        return

    with get_db() as conn:
        # Update user with Stripe customer ID and subscription status
        conn.execute(
            """UPDATE users
               SET stripe_customer_id = ?,
                   stripe_subscription_id = ?,
                   subscription_status = 'active',
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
    """
    subscription_id = subscription.get("id")
    status = subscription.get("status")  # active, past_due, canceled, unpaid
    customer_id = subscription.get("customer")
    cancel_at_period_end = 1 if subscription.get("cancel_at_period_end") else 0
    ends_at = _period_end_iso(subscription)
    user_id = (subscription.get("metadata") or {}).get("user_id")

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET stripe_customer_id = COALESCE(?, stripe_customer_id),
                   stripe_subscription_id = COALESCE(?, stripe_subscription_id),
                   subscription_status = ?,
                   subscription_cancel_at_period_end = ?,
                   subscription_ends_at = ?,
                   subscription_updated_at = ?
               WHERE id = ? OR stripe_customer_id = ? OR stripe_subscription_id = ?""",
            (customer_id, subscription_id, status, cancel_at_period_end, ends_at,
             datetime.now(timezone.utc).isoformat(),
             int(user_id) if user_id else -1, customer_id, subscription_id),
        )
        conn.commit()


def _period_end_iso(subscription: dict) -> str | None:
    """Convert a Stripe subscription current_period_end (unix) to ISO, if present."""
    ts = subscription.get("current_period_end")
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
    subscription_id = session.get("subscription")

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET stripe_customer_id = COALESCE(?, stripe_customer_id),
                   stripe_subscription_id = COALESCE(?, stripe_subscription_id),
                   subscription_status = 'active',
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

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET stripe_customer_id = COALESCE(?, stripe_customer_id),
                   stripe_subscription_id = COALESCE(?, stripe_subscription_id),
                   subscription_status = ?,
                   subscription_cancel_at_period_end = ?,
                   subscription_ends_at = ?,
                   subscription_updated_at = ?
               WHERE id = ?""",
            (
                customer_id,
                sub.get("id"),
                sub.get("status"),
                1 if sub.get("cancel_at_period_end") else 0,
                _period_end_iso(sub),
                datetime.now(timezone.utc).isoformat(),
                user_id,
            ),
        )
        conn.commit()

    return get_user_subscription_status(user_id)


def get_user_subscription_status(user_id: int) -> dict:
    """Get the subscription status for a user."""
    with get_db() as conn:
        user = conn.execute(
            """SELECT subscription_status, stripe_customer_id, is_admin,
                      subscription_cancel_at_period_end, subscription_ends_at
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
        }

    status = user["subscription_status"] or "none"
    is_admin = bool(user["is_admin"])
    # Admins always have full access and are never billed.
    has_access = is_admin or status in ("active", "trialing")

    return {
        "status": status,
        "has_access": has_access,
        "is_admin": is_admin,
        "stripe_customer_id": user["stripe_customer_id"],
        "cancel_at_period_end": bool(user["subscription_cancel_at_period_end"]),
        "ends_at": user["subscription_ends_at"],
    }
