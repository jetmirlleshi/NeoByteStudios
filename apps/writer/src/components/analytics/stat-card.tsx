"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

// ---------------------------------------------------------------------------
// Trend icon helper
// ---------------------------------------------------------------------------

const TREND_CONFIG = {
  up: {
    Icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
  },
  down: {
    Icon: TrendingDown,
    color: "text-red-600 dark:text-red-400",
  },
  neutral: {
    Icon: Minus,
    color: "text-gray-400 dark:text-gray-500",
  },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
}: StatCardProps) {
  const trendCfg = trend ? TREND_CONFIG[trend] : null;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex items-start gap-4 p-5">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold tracking-tight">
              {typeof value === "number" ? value.toLocaleString("it-IT") : value}
            </p>
            {trendCfg && (
              <trendCfg.Icon className={`h-4 w-4 ${trendCfg.color}`} />
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
