"use client";

import { useCallback, useState } from "react";
import { useAIStore } from "@/stores/ai-store";
import type { AISuggestion } from "@/stores/ai-store";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAISuggestions(projectId: string, chapterId: string) {
  const { suggestions, setSuggestions, clearSuggestions } = useAIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSuggestions = useCallback(
    async (recentText: string, trigger: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            chapterId,
            recentText,
            trigger,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({
            error: "Errore nel recupero suggerimenti",
          }));
          throw new Error(err.error ?? "Errore nel recupero suggerimenti");
        }

        const data = await res.json();
        const parsed: AISuggestion[] = (data.suggestions ?? []).map(
          (s: Record<string, unknown>) => ({
            type: s.type as string,
            title: s.title as string,
            description: s.description as string,
          })
        );

        setSuggestions(parsed);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Errore sconosciuto");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, chapterId, setSuggestions]
  );

  return {
    suggestions,
    fetchSuggestions,
    isLoading,
    error,
    clearSuggestions,
  };
}
