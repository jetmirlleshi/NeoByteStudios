"use client";

import { useCallback, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchResult {
  id: string;
  score: number;
  text: string;
  metadata: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAISearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(
    async (projectId: string, query: string, topK: number = 5) => {
      setIsSearching(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, query, topK }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({
            error: "Errore nella ricerca",
          }));
          throw new Error(err.error ?? "Errore nella ricerca");
        }

        const data = await res.json();
        const parsed: SearchResult[] = (data.results ?? []).map(
          (r: Record<string, unknown>) => ({
            id: r.id as string,
            score: r.score as number,
            text: r.text as string,
            metadata: (r.metadata ?? {}) as Record<string, unknown>,
          })
        );

        setResults(parsed);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Errore sconosciuto");
        setError(error);
        throw error;
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    results,
    isSearching,
    error,
    clearResults,
  };
}
