// ---------------------------------------------------------------------------
// POST /api/billing/portal — Create a Stripe Customer Portal session
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import {
  getAuthSession,
  unauthorized,
  badRequest,
} from "@/lib/api-helpers";
import { db, eq, nbwUserProfiles } from "@neobytestudios/db";
import { createPortalSession } from "@/lib/billing/stripe";

export const dynamic = "force-dynamic";

export async function POST() {
  // --- Auth ---
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;

  // --- Fetch Stripe customer ID ---
  const profile = await db.query.nbwUserProfiles.findFirst({
    where: eq(nbwUserProfiles.userId, userId),
    columns: { stripeCustomerId: true },
  });

  if (!profile?.stripeCustomerId) {
    return badRequest(
      "No Stripe customer found. Please subscribe to a plan first."
    );
  }

  // --- Create portal session ---
  const returnUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const url = await createPortalSession(
      profile.stripeCustomerId,
      `${returnUrl}/settings`
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[Billing Portal] Failed to create session:", error);
    return badRequest(
      error instanceof Error ? error.message : "Failed to create portal session"
    );
  }
}
