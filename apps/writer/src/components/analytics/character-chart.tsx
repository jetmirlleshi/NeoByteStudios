"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Users, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCharacterAnalytics } from "@/hooks/use-analytics";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CharacterChartProps {
  projectId: string;
}

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------

interface CharTooltipPayload {
  value: number;
  payload: { name: string; appearances: number; povCount: number; role: string };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: CharTooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-semibold">{d.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
        {d.role}
      </p>
      <div className="mt-1 space-y-0.5 text-xs">
        <p>
          Apparizioni:{" "}
          <span className="font-medium">
            {d.appearances.toLocaleString("it-IT")}
          </span>
        </p>
        <p>
          Scene POV:{" "}
          <span className="font-medium">
            {d.povCount.toLocaleString("it-IT")}
          </span>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CharacterChart({ projectId }: CharacterChartProps) {
  const { data, isLoading } = useCharacterAnalytics(projectId);

  // Sort by appearances descending
  const sorted = [...(data ?? [])].sort(
    (a, b) => b.appearances - a.appearances
  );

  const unusedCharacters = sorted.filter((c) => c.isUnused);
  const chartData = sorted.filter((c) => !c.isUnused);

  // --- Loading state ---

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Apparizioni personaggi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            Caricamento dati personaggi...
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Empty state ---

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Apparizioni personaggi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Nessun personaggio trovato nel progetto.
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Compute chart height dynamically based on number of characters ---
  const chartHeight = Math.max(200, chartData.length * 36);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Apparizioni personaggi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bar chart */}
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-gray-500 dark:text-gray-400"
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={120}
                className="text-gray-600 dark:text-gray-300"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar
                dataKey="appearances"
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Unused characters warning */}
        {unusedCharacters.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              Personaggi inutilizzati
            </div>
            <div className="flex flex-wrap gap-1.5">
              {unusedCharacters.map((c) => (
                <Badge
                  key={c.id}
                  variant="outline"
                  className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                >
                  {c.name}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400/80">
              Questi personaggi non compaiono in nessun capitolo. Considera di
              integrarli nella storia o rimuoverli.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
