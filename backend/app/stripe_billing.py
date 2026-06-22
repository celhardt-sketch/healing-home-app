"""
Stripe subscription billing module.
Handles checkout session creation, webhook processing, and billing portal.
Card data never touches our server — all handled by Stripe hosted checkout.
"""

import os
from datetime import datetime, timezone

import stripe

from .database import get_db


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
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except stripe.error.SignatureVerificationError:
        raise ValueError("Invalid webhook signature")
    except Exception as e:
        raise ValueError(f"Webhook error: {str(e)}")

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        _handle_checkout_completed(data)
    elif event_type == "customer.subscription.updated":
        _handle_subscription_updated(data)
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


def _handle_subscription_updated(subscription: dict) -> None:
    """Update subscription status (active, past_due, canceled, etc.)."""
    subscription_id = subscription.get("id")
    status = subscription.get("status")  # active, past_due, canceled, unpaid
    customer_id = subscription.get("customer")

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET subscription_status = ?,
                   subscription_updated_at = ?
               WHERE stripe_customer_id = ? OR stripe_subscription_id = ?""",
            (status, datetime.now(timezone.utc).isoformat(), customer_id, subscription_id),
        )
        conn.commit()


def _handle_subscription_deleted(subscription: dict) -> None:
    """Revoke access when subscription is fully canceled."""
    subscription_id = subscription.get("id")
    customer_id = subscription.get("customer")

    with get_db() as conn:
        conn.execute(
            """UPDATE users
               SET subscription_status = 'canceled',
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


def get_user_subscription_status(user_id: int) -> dict:
    """Get the subscription status for a user."""
    with get_db() as conn:
        user = conn.execute(
            "SELECT subscription_status, stripe_customer_id FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()

    if not user:
        return {"status": "none", "has_access": False}

    status = user["subscription_status"] or "none"
    has_access = status in ("active", "trialing")

    return {
        "status": status,
        "has_access": has_access,
        "stripe_customer_id": user["stripe_customer_id"],
    }
