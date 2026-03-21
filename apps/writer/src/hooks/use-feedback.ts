"use client";

import { useMutation } from "@tanstack/react-query";

// --- Types ---

type FeedbackType = "BUG" | "SUGGESTION" | "OTHER";

interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  email?: string;
}

interface FeedbackResponse {
  feedback: {
    id: string;
    userId: string;
    type: FeedbackType;
    message: string;
    email: string | null;
    createdAt: string;
  };
}

// --- Fetcher ---

async function sendFeedback(
  payload: FeedbackPayload
): Promise<FeedbackResponse> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore nell'invio del feedback");
  return data;
}

// --- Hook ---

export function useSendFeedback() {
  return useMutation({
    mutationFn: sendFeedback,
  });
}
