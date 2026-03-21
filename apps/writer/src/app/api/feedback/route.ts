import { NextRequest, NextResponse } from "next/server";
import { db, nbwFeedback } from "@neobytestudios/db";
import { getAuthSession, unauthorized, badRequest } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const VALID_TYPES = ["BUG", "SUGGESTION", "OTHER"] as const;
type FeedbackType = (typeof VALID_TYPES)[number];

// POST /api/feedback — Submit user feedback (requires auth)
export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  let body: {
    type?: string;
    message?: string;
    email?: string;
  };
  try {
    body = await request.json();
  } catch {
    return badRequest("Corpo della richiesta non valido");
  }

  // Validate type
  const type = body.type?.toUpperCase() as FeedbackType | undefined;
  if (!type || !VALID_TYPES.includes(type)) {
    return badRequest(
      `Tipo non valido. Valori ammessi: ${VALID_TYPES.join(", ")}`
    );
  }

  // Validate message
  const message = body.message?.trim();
  if (!message || message.length < 10) {
    return badRequest("Il messaggio deve essere di almeno 10 caratteri");
  }
  if (message.length > 5000) {
    return badRequest("Il messaggio non può superare i 5000 caratteri");
  }

  const [feedback] = await db
    .insert(nbwFeedback)
    .values({
      userId: session.user.id,
      type,
      message,
      email: body.email?.trim() || null,
    })
    .returning();

  return NextResponse.json({ feedback }, { status: 201 });
}
