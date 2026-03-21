"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProgress } from "@/hooks/use-analytics";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProgressChartProps {
  projectId: string;
  days?: number;
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function ChartSkeleton() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
        <CalendarDays className="h-8 w-8 animate-pulse" />
        <span className="text-sm">Caricamento dati...</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------

interface TooltipPayload {
  value: number;
  payload: { date: string; wordsWritten: number; cumulativeWords: number };
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {formatDate(label ?? "")}
      </p>
      <p className="text-sm font-semibold">
        {data.wordsWritten.toLocaleString("it-IT")} parole
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Totale: {data.cumulativeWords.toLocaleString("it-IT")}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

function formatTick(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProgressChart({ projectId, days = 90 }: ProgressChartProps) {
  const { data, isLoading } = useProgress(projectId, days);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4" />
          Progresso di scrittura
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Nessun dato disponibile. Inizia a scrivere!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                className="text-gray-500 dark:text-gray-400"
              />
              <YAxis
                tickFormatter={(v: number) => v.toLocaleString("it-IT")}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={50}
                className="text-gray-500 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="wordsWritten"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#progressGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
