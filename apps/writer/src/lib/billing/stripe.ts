// ---------------------------------------------------------------------------
// Stripe server-side utilities
// ---------------------------------------------------------------------------

import Stripe from "stripe";
import { db, eq, nbwUserProfiles } from "@neobytestudios/db";

// ---------------------------------------------------------------------------
// Singleton Stripe client (lazy-init)
// ---------------------------------------------------------------------------

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your environment variables."
    );
  }

  _stripe = new Stripe(key, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });

  return _stripe;
}

// ---------------------------------------------------------------------------
// Price ID -> Subscription tier mapping
// ---------------------------------------------------------------------------

/**
 * Maps a Stripe price ID to the corresponding subscription tier.
 * Returns null if the price ID doesn't match any known tier.
 */
export function getTierFromPriceId(
  priceId: string
): "WRITER" | "PROFESSIONAL" | null {
  const writerMonthly = process.env.STRIPE_PRICE_WRITER_MONTHLY;
  const writerYearly = process.env.STRIPE_PRICE_WRITER_YEARLY;
  const proMonthly = process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY;
  const proYearly = process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY;

  if (priceId === writerMonthly || priceId === writerYearly) {
    return "WRITER";
  }
  if (priceId === proMonthly || priceId === proYearly) {
    return "PROFESSIONAL";
  }

  return null;
}

// ---------------------------------------------------------------------------
// Customer management
// ---------------------------------------------------------------------------

/**
 * Retrieves the Stripe customer ID for a user, creating a new Stripe
 * customer if one doesn't already exist. The ID is persisted in
 * `nbwUserProfiles.stripeCustomerId` for future lookups.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  // Check if the user already has a Stripe customer ID
  const profile = await db.query.nbwUserProfiles.findFirst({
    where: eq(nbwUserProfiles.userId, userId),
    columns: { stripeCustomerId: true },
  });

  if (profile?.stripeCustomerId) {
    return profile.stripeCustomerId;
  }

  // Create a new Stripe customer
  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  // Persist the customer ID back to the profile
  await db
    .update(nbwUserProfiles)
    .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
    .where(eq(nbwUserProfiles.userId, userId));

  return customer.id;
}

// ---------------------------------------------------------------------------
// Checkout session
// ---------------------------------------------------------------------------

/**
 * Creates a Stripe Checkout session for a subscription and returns the URL.
 */
export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  priceId: string;
  returnUrl: string;
}): Promise<string> {
  const { userId, email, priceId, returnUrl } = params;

  const stripe = getStripeClient();
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?checkout=success`,
    cancel_url: `${returnUrl}?checkout=cancelled`,
    subscription_data: {
      metadata: { userId },
    },
    metadata: { userId },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return session.url;
}

// ---------------------------------------------------------------------------
// Customer portal session
// ---------------------------------------------------------------------------

/**
 * Creates a Stripe Customer Portal session and returns its URL.
 * The portal lets users manage their subscription (upgrade, cancel, etc.).
 */
export async function createPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripeClient();

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });

  return session.url;
}
