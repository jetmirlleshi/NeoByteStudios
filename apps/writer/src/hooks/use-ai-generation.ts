"use client";

import { useCallback, useRef } from "react";
import { useAIStore } from "@/stores/ai-store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GenerateParams {
  projectId: string;
  chapterId: string;
  type: string;
  recentText: string;
  instruction?: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAIGeneration() {
  const {
    isGenerating,
    generatedText,
    setGenerating,
    appendText,
    clearGenerated,
    setGenerationType,
    addToHistory,
  } = useAIStore();

  const abortRef = useRef<AbortController | null>(null);

  // --- Generate (SSE streaming) ---

  const generate = useCallback(
    async (params: GenerateParams) => {
      // Abort any in-flight request
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      // Reset state
      clearGenerated();
      setGenerationType(params.type);
      setGenerating(true);

      let accumulated = "";

      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Errore di generazione" }));
          throw new Error(err.error ?? "Errore di generazione");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("Nessun body nella risposta");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines from the buffer
          const lines = buffer.split("\n");
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const jsonStr = trimmed.slice(6); // Remove "data: "
            if (jsonStr === "[DONE]") continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.text) {
                appendText(data.text);
                accumulated += data.text;
              }

              if (data.done) {
                // Stream completed successfully
                setGenerating(false);
                addToHistory(params.type, accumulated);
                return;
              }

              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseErr) {
              // Skip malformed JSON lines (could be partial data)
              if (parseErr instanceof SyntaxError) continue;
              throw parseErr;
            }
          }
        }

        // If we reach here without a "done" event, finalize anyway
        if (accumulated) {
          addToHistory(params.type, accumulated);
        }
        setGenerating(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User cancelled — keep whatever text was accumulated
          setGenerating(false);
          return;
        }
        setGenerating(false);
        throw err;
      }
    },
    [clearGenerated, setGenerationType, setGenerating, appendText, addToHistory]
  );

  // --- Cancel ---

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setGenerating(false);
  }, [setGenerating]);

  // --- Accept (return text for editor insertion, then clear) ---

  const acceptText = useCallback(() => {
    const text = useAIStore.getState().generatedText;
    clearGenerated();
    return text;
  }, [clearGenerated]);

  // --- Discard (clear without returning) ---

  const discardText = useCallback(() => {
    clearGenerated();
  }, [clearGenerated]);

  return {
    generate,
    cancel,
    isGenerating,
    generatedText,
    acceptText,
    discardText,
  };
}
