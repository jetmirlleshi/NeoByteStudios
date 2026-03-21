"use client";

import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Shield,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useCoherenceStore } from "@/stores/coherence-store";
import type { CoherenceAlert } from "@/stores/coherence-store";
import { useCoherenceCheck } from "@/hooks/use-coherence";

// ---------------------------------------------------------------------------
// Severity config
// ---------------------------------------------------------------------------

const SEVERITY_CONFIG = {
  CRITICAL: {
    icon: AlertTriangle,
    bgColor: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
    textColor: "text-red-700 dark:text-red-400",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
    label: "Critico",
  },
  WARNING: {
    icon: AlertCircle,
    bgColor: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900",
    textColor: "text-yellow-700 dark:text-yellow-400",
    badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400",
    label: "Avviso",
  },
  INFO: {
    icon: Info,
    bgColor: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
    textColor: "text-blue-700 dark:text-blue-400",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
    label: "Info",
  },
} as const;

// ---------------------------------------------------------------------------
// Tier tabs config
// ---------------------------------------------------------------------------

const TIER_TABS = [
  { tier: 1 as const, label: "Locale (gratuito)", description: "Controlli regex in tempo reale" },
  { tier: 2 as const, label: "Analisi rapida", description: "IA per controlli veloci" },
  { tier: 3 as const, label: "Analisi profonda", description: "IA per analisi approfondita" },
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CoherencePanelProps {
  projectId: string;
  chapterId: string;
  text?: string;
  contextBefore?: string;
  contextAfter?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CoherencePanel({
  projectId,
  chapterId,
  text,
  contextBefore,
  contextAfter,
}: CoherencePanelProps) {
  const { alerts, tier1Alerts, dismissAlert } = useCoherenceStore();
  const { runCheck, isChecking } = useCoherenceCheck();
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);

  // Combine tier1 (live) + server alerts for display
  const allAlerts = [...tier1Alerts, ...alerts];

  // Severity breakdown
  const criticalCount = allAlerts.filter((a) => a.severity === "CRITICAL").length;
  const warningCount = allAlerts.filter((a) => a.severity === "WARNING").length;
  const infoCount = allAlerts.filter((a) => a.severity === "INFO").length;

  // --- Handlers ---

  const handleRunCheck = async () => {
    if (selectedTier === 1) return; // Tier 1 runs automatically
    try {
      await runCheck({
        projectId,
        chapterId,
        text,
        tier: selectedTier,
        contextBefore,
        contextAfter,
      });
    } catch {
      // Error handled in hook
    }
  };

  const handleDismiss = (index: number) => {
    // Only dismiss server alerts (offset by tier1 length)
    const serverIndex = index - tier1Alerts.length;
    if (serverIndex >= 0) {
      dismissAlert(serverIndex);
    }
  };

  // --- Render ---

  return (
    <div className="flex flex-col gap-4">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Coerenza narrativa
        </h3>
      </div>

      {/* Summary header */}
      <div className="rounded-lg border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {allAlerts.length === 0
            ? "Nessun problema trovato"
            : `${allAlerts.length} alert${allAlerts.length !== 1 ? "" : ""} trovat${allAlerts.length !== 1 ? "i" : "o"}`}
        </div>
        {allAlerts.length > 0 && (
          <div className="mt-1.5 flex gap-3 text-xs">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3 w-3" />
                {criticalCount} critici
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-3 w-3" />
                {warningCount} avvisi
              </span>
            )}
            {infoCount > 0 && (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Info className="h-3 w-3" />
                {infoCount} info
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tier selector tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {TIER_TABS.map(({ tier, label }) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              selectedTier === tier
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tier description + run button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {TIER_TABS.find((t) => t.tier === selectedTier)?.description}
        </span>
        {selectedTier > 1 && (
          <button
            onClick={handleRunCheck}
            disabled={isChecking}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Analisi...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3" />
                Esegui controllo
              </>
            )}
          </button>
        )}
      </div>

      {/* Alert cards */}
      {allAlerts.length > 0 ? (
        <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto">
          {allAlerts.map((alert, index) => (
            <AlertCard
              key={`${alert.type}-${index}`}
              alert={alert}
              onDismiss={() => handleDismiss(index)}
              onResolve={
                alert.id
                  ? () => {
                      /* handled via useCoherenceAlerts mutation */
                    }
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center dark:border-gray-700">
          <Shield className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {selectedTier === 1
              ? "I controlli locali sono attivi in tempo reale"
              : "Esegui un controllo per verificare la coerenza"}
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Alert Card sub-component
// ---------------------------------------------------------------------------

interface AlertCardProps {
  alert: CoherenceAlert;
  onDismiss: () => void;
  onResolve?: () => void;
}

function AlertCard({ alert, onDismiss, onResolve }: AlertCardProps) {
  const config = SEVERITY_CONFIG[alert.severity];
  const SeverityIcon = config.icon;
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`rounded-lg border p-3 ${config.bgColor}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <SeverityIcon className={`mt-0.5 h-4 w-4 shrink-0 ${config.textColor}`} />
          <div className="min-w-0">
            {/* Type badge */}
            <span
              className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${config.badgeColor}`}
            >
              {alert.type.replace(/_/g, " ")}
            </span>
            {/* Title */}
            <p className={`text-sm font-medium ${config.textColor}`}>
              {alert.title}
            </p>
          </div>
        </div>

        {/* Expand/collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {expanded ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Expandable content */}
      {expanded && (
        <div className="mt-2 pl-6">
          {/* Description */}
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {alert.description}
          </p>

          {/* Text snippet */}
          {alert.textSnippet && (
            <p className="mt-2 rounded border border-gray-200 bg-white/60 px-2 py-1.5 text-xs italic text-gray-500 dark:border-gray-600 dark:bg-gray-900/40 dark:text-gray-400">
              &ldquo;{alert.textSnippet}&rdquo;
            </p>
          )}

          {/* Suggestion */}
          {alert.suggestion && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Suggerimento:</span>{" "}
              {alert.suggestion}
            </p>
          )}

          {/* Action buttons (only for server-side alerts with an id) */}
          {alert.id && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={onDismiss}
                className="rounded border px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Ignora
              </button>
              {onResolve && (
                <button
                  onClick={onResolve}
                  className="rounded border border-green-300 px-2 py-1 text-[10px] font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                >
                  Risolto
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
