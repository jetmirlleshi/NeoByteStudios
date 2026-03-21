// ---------------------------------------------------------------------------
// POST /api/webhooks/stripe — Stripe webhook handler
// ---------------------------------------------------------------------------
// This route is UNAUTHENTICATED. Stripe signs every event with a secret,
// and we verify that signature instead of checking a user session.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, eq, nbwUserProfiles } from "@neobytestudios/db";
import { getStripeClient, getTierFromPriceId } from "@/lib/billing/stripe";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find a user profile by their Stripe customer ID.
 */
async function findProfileByCustomerId(customerId: string) {
  return db.query.nbwUserProfiles.findFirst({
    where: eq(nbwUserProfiles.stripeCustomerId, customerId),
  });
}

/**
 * Extract the first price ID from a Stripe subscription object.
 */
function getPriceIdFromSubscription(
  subscription: Stripe.Subscription
): string | null {
  const item = subscription.items?.data?.[0];
  return item?.price?.id ?? null;
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!customerId || !subscriptionId) {
    console.warn(
      "[Stripe Webhook] checkout.session.completed missing customer or subscription"
    );
    return;
  }

  // Retrieve the full subscription to get the price ID
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = getPriceIdFromSubscription(subscription);

  if (!priceId) {
    console.warn(
      "[Stripe Webhook] checkout.session.completed: no price ID on subscription",
      subscriptionId
    );
    return;
  }

  const tier = getTierFromPriceId(priceId);
  if (!tier) {
    console.warn(
      "[Stripe Webhook] checkout.session.completed: unknown price ID",
      priceId
    );
    return;
  }

  // Find user by customer ID and update their profile
  const profile = await findProfileByCustomerId(customerId);
  if (!profile) {
    console.warn(
      "[Stripe Webhook] checkout.session.completed: no profile for customer",
      customerId
    );
    return;
  }

  await db
    .update(nbwUserProfiles)
    .set({
      subscriptionTier: tier,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date(),
    })
    .where(eq(nbwUserProfiles.stripeCustomerId, customerId));

  console.info(
    `[Stripe Webhook] User ${profile.userId} upgraded to ${tier}`
  );
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) {
    console.warn(
      "[Stripe Webhook] customer.subscription.updated: missing customer ID"
    );
    return;
  }

  const priceId = getPriceIdFromSubscription(subscription);
  if (!priceId) {
    console.warn(
      "[Stripe Webhook] customer.subscription.updated: no price ID"
    );
    return;
  }

  const tier = getTierFromPriceId(priceId);
  if (!tier) {
    console.warn(
      "[Stripe Webhook] customer.subscription.updated: unknown price ID",
      priceId
    );
    return;
  }

  const profile = await findProfileByCustomerId(customerId);
  if (!profile) {
    console.warn(
      "[Stripe Webhook] customer.subscription.updated: no profile for customer",
      customerId
    );
    return;
  }

  await db
    .update(nbwUserProfiles)
    .set({
      subscriptionTier: tier,
      stripeSubscriptionId: subscription.id,
      updatedAt: new Date(),
    })
    .where(eq(nbwUserProfiles.stripeCustomerId, customerId));

  console.info(
    `[Stripe Webhook] User ${profile.userId} subscription updated to ${tier}`
  );
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) {
    console.warn(
      "[Stripe Webhook] customer.subscription.deleted: missing customer ID"
    );
    return;
  }

  const profile = await findProfileByCustomerId(customerId);
  if (!profile) {
    console.warn(
      "[Stripe Webhook] customer.subscription.deleted: no profile for customer",
      customerId
    );
    return;
  }

  await db
    .update(nbwUserProfiles)
    .set({
      subscriptionTier: "FREE",
      stripeSubscriptionId: null,
      updatedAt: new Date(),
    })
    .where(eq(nbwUserProfiles.stripeCustomerId, customerId));

  console.info(
    `[Stripe Webhook] User ${profile.userId} subscription cancelled, reverted to FREE`
  );
}

function handlePaymentFailed(invoice: Stripe.Invoice): void {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  console.warn(
    `[Stripe Webhook] Payment failed for customer ${customerId ?? "unknown"}`,
    { invoiceId: invoice.id, attemptCount: invoice.attempt_count }
  );

  // Future: send user a notification email via Resend
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  // Read the raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // Verify the event signature
  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error(
      "[Stripe Webhook] Signature verification failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Route events to handlers
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_failed":
        handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // Log unhandled event types for debugging, but return 200
        console.info(
          `[Stripe Webhook] Unhandled event type: ${event.type}`
        );
    }
  } catch (error) {
    console.error(
      `[Stripe Webhook] Error handling ${event.type}:`,
      error instanceof Error ? error.message : error
    );
    // Return 200 even on handler errors to prevent Stripe retries
    // for events we've already received. The error is logged above.
    return NextResponse.json({ received: true, error: "Handler error" });
  }

  return NextResponse.json({ received: true });
}
