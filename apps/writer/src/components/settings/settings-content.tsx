"use client";

import {
  Crown,
  Sparkles,
  FolderOpen,
  FileOutput,
  CreditCard,
  Settings,
  User,
  Download,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useBillingStatus, useCreatePortal } from "@/hooks/use-billing";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsContentProps {
  userName: string;
  userEmail: string;
}

// ---------------------------------------------------------------------------
// Tier badge
// ---------------------------------------------------------------------------

const TIER_STYLES: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  WRITER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PROFESSIONAL:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${TIER_STYLES[tier] ?? TIER_STYLES.FREE}`}
    >
      <Crown className="h-4 w-4" />
      {tier}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Usage meter
// ---------------------------------------------------------------------------

function UsageMeter({
  icon,
  label,
  current,
  max,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  max: number;
}) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  const isNearLimit = pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          {icon}
          {label}
        </span>
        <span className="font-medium tabular-nums">
          {current}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full transition-all ${
            isNearLimit
              ? "bg-amber-500 dark:bg-amber-400"
              : "bg-blue-500 dark:bg-blue-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SettingsContent({ userName, userEmail }: SettingsContentProps) {
  const { data: billing, isLoading } = useBillingStatus();
  const createPortal = useCreatePortal();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Impostazioni</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Gestisci il tuo account e il tuo piano
        </p>
      </div>

      <div className="space-y-6">
        {/* ---- Piano attuale ---- */}
        <div className="rounded-lg border p-6 dark:border-gray-800">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5" />
            Piano attuale
          </h2>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              Caricamento...
            </div>
          ) : billing ? (
            <div className="space-y-5">
              {/* Tier badge */}
              <div>
                <TierBadge tier={billing.tier} />
              </div>

              {/* Trial notice */}
              {billing.trialEndsAt && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                  <Clock className="h-4 w-4 shrink-0" />
                  Periodo di prova fino al{" "}
                  {new Date(billing.trialEndsAt).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}

              {/* Usage meters */}
              <div className="space-y-3">
                <UsageMeter
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Generazioni AI oggi"
                  current={billing.aiGenerationsToday}
                  max={billing.aiGenerationsLimit}
                />
                <UsageMeter
                  icon={<FolderOpen className="h-4 w-4" />}
                  label="Progetti"
                  current={billing.projectsUsed}
                  max={billing.projectsLimit}
                />

                {/* Export status (not a meter) */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileOutput className="h-4 w-4" />
                    Esportazione
                  </span>
                  <span
                    className={`font-medium ${
                      billing.exportEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {billing.exportEnabled ? "Abilitata" : "Disabilitata"}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 border-t pt-4 dark:border-gray-700">
                {billing.tier === "FREE" && (
                  <button
                    onClick={() =>
                      toast.info("Upgrade non ancora disponibile")
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Passa a Writer
                  </button>
                )}

                {billing.tier !== "FREE" && (
                  <button
                    onClick={() => createPortal.mutateAsync()}
                    disabled={createPortal.isPending}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    {createPortal.isPending
                      ? "Reindirizzamento..."
                      : "Gestisci abbonamento"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Impossibile caricare i dati del piano.
            </p>
          )}
        </div>

        {/* ---- Preferenze ---- */}
        <div className="rounded-lg border p-6 dark:border-gray-800">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5" />
            Preferenze
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Le preferenze saranno disponibili a breve.
          </p>
        </div>

        {/* ---- Account ---- */}
        <div className="rounded-lg border p-6 dark:border-gray-800">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5" />
            Account
          </h2>

          <div className="space-y-4">
            {/* User info */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Nome
                </p>
                <p className="mt-1 font-medium">{userName}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="mt-1 font-medium">{userEmail}</p>
              </div>
            </div>

            {/* GDPR export */}
            <div className="border-t pt-4 dark:border-gray-700">
              <button
                onClick={() => toast.info("Esportazione GDPR in arrivo")}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Download className="h-4 w-4" />
                Esporta i miei dati
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
