"use client";

import {
  Lightbulb,
  User,
  MapPin,
  MessageCircle,
  Flame,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAISuggestions } from "@/hooks/use-ai-suggestions";
import type { AISuggestion } from "@/stores/ai-store";

// ---------------------------------------------------------------------------
// Suggestion type icons
// ---------------------------------------------------------------------------

const TYPE_ICONS: Record<string, typeof Lightbulb> = {
  plot: Lightbulb,
  character: User,
  setting: MapPin,
  dialogue: MessageCircle,
  tension: Flame,
};

const TYPE_LABELS: Record<string, string> = {
  plot: "Trama",
  character: "Personaggio",
  setting: "Ambientazione",
  dialogue: "Dialogo",
  tension: "Tensione",
};

const TYPE_COLORS: Record<string, string> = {
  plot: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  character: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  setting: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  dialogue: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  tension: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AISuggestionsPanelProps {
  projectId: string;
  chapterId: string;
  recentText: string;
  onUseSuggestion?: (suggestion: AISuggestion) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AISuggestionsPanel({
  projectId,
  chapterId,
  recentText,
  onUseSuggestion,
}: AISuggestionsPanelProps) {
  const { suggestions, fetchSuggestions, isLoading, clearSuggestions } =
    useAISuggestions(projectId, chapterId);

  // --- Handlers ---

  const handleRefresh = async () => {
    if (!recentText.trim()) return;
    try {
      await fetchSuggestions(recentText, "manual");
    } catch {
      // Error handled in hook
    }
  };

  const handleUseSuggestion = (suggestion: AISuggestion) => {
    onUseSuggestion?.(suggestion);
  };

  // --- Render ---

  return (
    <div className="flex flex-col gap-4">
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Suggerimenti IA
        </h3>
        {suggestions.length > 0 && (
          <button
            onClick={clearSuggestions}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Cancella
          </button>
        )}
      </div>

      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        disabled={isLoading || !recentText.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generazione suggerimenti...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Aggiorna suggerimenti
          </>
        )}
      </button>

      {/* Suggestion cards */}
      {suggestions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={`${suggestion.type}-${index}`}
              suggestion={suggestion}
              onClick={() => handleUseSuggestion(suggestion)}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-lg border border-dashed p-8 text-center dark:border-gray-700">
          <Sparkles className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Nessun suggerimento disponibile
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Clicca &ldquo;Aggiorna suggerimenti&rdquo; per ricevere idee dall&rsquo;IA
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Suggestion Card sub-component
// ---------------------------------------------------------------------------

interface SuggestionCardProps {
  suggestion: AISuggestion;
  onClick: () => void;
}

function SuggestionCard({ suggestion, onClick }: SuggestionCardProps) {
  const Icon = TYPE_ICONS[suggestion.type] ?? Lightbulb;
  const label = TYPE_LABELS[suggestion.type] ?? suggestion.type;
  const colorClass =
    TYPE_COLORS[suggestion.type] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-lg border p-3 text-left transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
    >
      {/* Type badge */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${colorClass}`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {suggestion.title}
      </p>

      {/* Description */}
      <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {suggestion.description}
      </p>
    </button>
  );
}
