"use client";

import {
  Gauge,
  Sparkles,
  FolderOpen,
  FileDown,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useBillingStatus } from "@/hooks/use-billing";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface UsageCardProps {
  projectId?: string;
}

// ---------------------------------------------------------------------------
// Tier display config
// ---------------------------------------------------------------------------

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  FREE: {
    label: "Gratuito",
    color: "border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-400",
  },
  WRITER: {
    label: "Scrittore",
    color: "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400",
  },
  PROFESSIONAL: {
    label: "Professionista",
    color: "border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400",
  },
};

// ---------------------------------------------------------------------------
// Usage row helper
// ---------------------------------------------------------------------------

function UsageRow({
  icon: Icon,
  label,
  used,
  limit,
  suffix,
}: {
  icon: typeof Sparkles;
  label: string;
  used: number;
  limit: number;
  suffix?: string;
}) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        <span
          className={`font-medium ${
            isNearLimit
              ? "text-amber-600 dark:text-amber-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {used.toLocaleString("it-IT")}/{limit.toLocaleString("it-IT")}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UsageCard({ projectId: _projectId }: UsageCardProps) {
  const { data, isLoading } = useBillingStatus();

  // --- Loading state ---

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" />
            Utilizzo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" />
            Utilizzo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Impossibile caricare i dati di utilizzo.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tierCfg = TIER_LABELS[data.tier] ?? TIER_LABELS.FREE;

  // Calculate trial remaining days
  let trialDaysRemaining: number | null = null;
  if (data.trialEndsAt) {
    const diff = new Date(data.trialEndsAt).getTime() - Date.now();
    trialDaysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4" />
            Utilizzo
          </CardTitle>
          <Badge variant="outline" className={tierCfg.color}>
            {tierCfg.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI generations */}
        <UsageRow
          icon={Sparkles}
          label="Generazioni IA oggi"
          used={data.aiGenerationsToday}
          limit={data.aiGenerationsLimit}
        />

        {/* Projects */}
        <UsageRow
          icon={FolderOpen}
          label="Progetti"
          used={data.projectsUsed}
          limit={data.projectsLimit}
        />

        {/* Export status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <FileDown className="h-4 w-4" />
            Esportazione
          </div>
          <Badge
            variant="outline"
            className={
              data.exportEnabled
                ? "border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
                : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
            }
          >
            {data.exportEnabled ? "Abilitata" : "Non disponibile"}
          </Badge>
        </div>

        {/* Trial info */}
        {trialDaysRemaining !== null && trialDaysRemaining > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
              <Clock className="h-4 w-4" />
              Periodo di prova
            </div>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              {trialDaysRemaining === 1
                ? "Rimane 1 giorno di prova gratuita."
                : `Rimangono ${trialDaysRemaining} giorni di prova gratuita.`}
            </p>
          </div>
        )}

        {trialDaysRemaining === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
              <Clock className="h-4 w-4" />
              Prova scaduta
            </div>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Il tuo periodo di prova è terminato. Scegli un piano per
              continuare a usare tutte le funzionalità.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
