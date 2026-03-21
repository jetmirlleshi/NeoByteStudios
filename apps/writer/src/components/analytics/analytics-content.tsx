"use client";

import { useMemo } from "react";
import {
  PenLine,
  BookOpen,
  TrendingUp,
  Calendar,
  BarChart3,
  Clock,
  Flame,
  FileText,
  MessageCircle,
  Hash,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import {
  useProjectStats,
  useProgress,
  useCalendar,
  useTextAnalysis,
} from "@/hooks/use-analytics";

// ---------------------------------------------------------------------------
// Stat card (local helper, same pattern as dashboard)
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-6 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weekly progress bars
// ---------------------------------------------------------------------------

function WeeklyProgress({ projectId }: { projectId: string }) {
  const { data, isLoading } = useProgress(projectId, 7);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Progresso settimanale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            Caricamento...
          </div>
        </CardContent>
      </Card>
    );
  }

  const days = data ?? [];
  const maxWords = Math.max(1, ...days.map((d) => d.wordsWritten));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4" />
          Progresso settimanale
        </CardTitle>
      </CardHeader>
      <CardContent>
        {days.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Nessun dato disponibile. Inizia a scrivere!
          </div>
        ) : (
          <div className="space-y-3">
            {days.map((day) => {
              const pct = Math.max(2, (day.wordsWritten / maxWords) * 100);
              const dateLabel = formatDateShort(day.date);
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-right text-sm text-gray-500 dark:text-gray-400">
                    {dateLabel}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-6 rounded bg-blue-500 transition-all dark:bg-blue-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-sm font-medium tabular-nums">
                    {day.wordsWritten.toLocaleString("it-IT")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Writing calendar (simplified heatmap - last 30 days)
// ---------------------------------------------------------------------------

function WritingCalendarSimple({ projectId }: { projectId: string }) {
  const { data, isLoading } = useCalendar(projectId);

  const last30 = useMemo(() => {
    if (!data?.days) return [];
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    const cutoff = thirtyDaysAgo.toISOString().slice(0, 10);

    // Filter to last 30 days, fill missing days with 0
    const dayMap = new Map(data.days.map((d) => [d.date, d.wordsWritten]));
    const result: Array<{ date: string; words: number }> = [];
    const d = new Date(thirtyDaysAgo);
    while (d <= today) {
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, words: dayMap.get(key) ?? 0 });
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [data?.days]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Calendario scrittura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            Caricamento calendario...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Calendario scrittura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak info */}
        {data && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">{data.currentStreak}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {data.currentStreak === 1
                  ? "giorno consecutivo"
                  : "giorni consecutivi"}
              </span>
            </div>
            <div className="text-gray-400 dark:text-gray-500">|</div>
            <div className="text-gray-500 dark:text-gray-400">
              Record:{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {data.longestStreak}
              </span>{" "}
              giorni
            </div>
          </div>
        )}

        {/* 30-day grid */}
        <div className="flex flex-wrap gap-1">
          {last30.map((day) => (
            <div
              key={day.date}
              className={`h-5 w-5 rounded-sm ${getCalendarColor(day.words)}`}
              title={`${formatDateFull(day.date)}: ${day.words.toLocaleString("it-IT")} parole`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span>Meno</span>
          <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900" />
          <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-700" />
          <div className="h-3 w-3 rounded-sm bg-green-500" />
          <span>Più</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Text analysis (simplified)
// ---------------------------------------------------------------------------

function TextAnalysisSimple({ projectId }: { projectId: string }) {
  const { data, isLoading } = useTextAnalysis(projectId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Analisi del testo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            Analisi in corso...
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
            <FileText className="h-4 w-4" />
            Analisi del testo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Scrivi almeno un capitolo per vedere l&apos;analisi.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          Analisi del testo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Dialogue ratio */}
          <div className="flex flex-col items-center gap-1 rounded-lg border p-4 dark:border-gray-700">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold">
              {(data.dialogueRatio * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Rapporto dialoghi
            </span>
          </div>

          {/* Gulpease */}
          <div className="flex flex-col items-center gap-1 rounded-lg border p-4 dark:border-gray-700">
            <BookOpen className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold">
              {data.gulpease.toFixed(0)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Indice Gulpease
            </span>
          </div>

          {/* Type-token ratio */}
          <div className="flex flex-col items-center gap-1 rounded-lg border p-4 dark:border-gray-700">
            <Hash className="h-5 w-5 text-purple-500" />
            <span className="text-2xl font-bold">
              {data.typeTokenRatio.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Type-Token Ratio
            </span>
          </div>
        </div>

        {/* Top 5 words */}
        {data.topWords.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Parole più frequenti
            </p>
            <div className="space-y-1.5">
              {data.topWords.slice(0, 5).map((w, i) => (
                <div
                  key={w.word}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    <span className="mr-2 text-gray-400">{i + 1}.</span>
                    {w.word}
                  </span>
                  <span className="tabular-nums text-gray-500 dark:text-gray-400">
                    {w.count.toLocaleString("it-IT")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Analytics dashboard (composed from above)
// ---------------------------------------------------------------------------

function AnalyticsDashboard({ projectId }: { projectId: string }) {
  const { data: stats, isLoading } = useProjectStats(projectId);

  return (
    <div className="space-y-6">
      {/* Stats cards row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={
            <PenLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          }
          iconBg="bg-blue-50 dark:bg-blue-950"
          label="Parole totali"
          value={
            isLoading
              ? "..."
              : (stats?.totalWords ?? 0).toLocaleString("it-IT")
          }
        />
        <StatCard
          icon={
            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
          }
          iconBg="bg-green-50 dark:bg-green-950"
          label="Capitoli"
          value={isLoading ? "..." : String(stats?.totalChapters ?? 0)}
        />
        <StatCard
          icon={
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          }
          iconBg="bg-purple-50 dark:bg-purple-950"
          label="Parole oggi"
          value={
            isLoading
              ? "..."
              : (stats?.todayWords ?? 0).toLocaleString("it-IT")
          }
        />
        <StatCard
          icon={
            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          }
          iconBg="bg-orange-50 dark:bg-orange-950"
          label="Streak"
          value={isLoading ? "..." : `${stats?.currentStreak ?? 0} gg`}
        />
      </div>

      {/* Weekly progress */}
      <WeeklyProgress projectId={projectId} />

      {/* Writing calendar */}
      <WritingCalendarSimple projectId={projectId} />

      {/* Text analysis */}
      <TextAnalysisSimple projectId={projectId} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export — wraps in ProjectSelector
// ---------------------------------------------------------------------------

export function AnalyticsContent() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Statistiche</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Monitora i tuoi progressi di scrittura
        </p>
      </div>

      <ProjectSelector>
        {(projectId) => <AnalyticsDashboard projectId={projectId} />}
      </ProjectSelector>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

function formatDateFull(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getCalendarColor(words: number): string {
  if (words === 0) return "bg-gray-100 dark:bg-gray-800";
  if (words <= 100) return "bg-green-100 dark:bg-green-900";
  if (words <= 500) return "bg-green-300 dark:bg-green-700";
  return "bg-green-500";
}
