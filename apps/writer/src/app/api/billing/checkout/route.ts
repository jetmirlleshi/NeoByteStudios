// ---------------------------------------------------------------------------
// POST /api/billing/checkout — Create a Stripe Checkout session
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import {
  getAuthSession,
  unauthorized,
  badRequest,
} from "@/lib/api-helpers";
import { createCheckoutSession } from "@/lib/billing/stripe";

export const dynamic = "force-dynamic";

interface CheckoutBody {
  priceId?: string;
}

export async function POST(request: NextRequest) {
  // --- Auth ---
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;
  const email = session.user.email;

  if (!email) {
    return badRequest("User email is required for checkout");
  }

  // --- Parse body ---
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { priceId } = body;
  if (!priceId?.trim()) {
    return badRequest("priceId is required");
  }

  // --- Create checkout session ---
  const returnUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const url = await createCheckoutSession({
      userId,
      email,
      priceId,
      returnUrl: `${returnUrl}/settings`,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[Billing Checkout] Failed to create session:", error);
    return badRequest(
      error instanceof Error ? error.message : "Failed to create checkout session"
    );
  }
}
