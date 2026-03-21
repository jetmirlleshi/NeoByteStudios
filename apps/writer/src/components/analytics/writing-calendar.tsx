"use client";

import { useMemo, useState, useCallback } from "react";
import { Flame, CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCalendar } from "@/hooks/use-analytics";
import type { CalendarDay } from "@/hooks/use-analytics";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface WritingCalendarProps {
  projectId: string;
  year?: number;
}

// ---------------------------------------------------------------------------
// Color scale
// ---------------------------------------------------------------------------

const COLOR_LEVELS = [
  "bg-gray-100 dark:bg-gray-800",          // 0 words
  "bg-green-200 dark:bg-green-900/60",      // level 1
  "bg-green-400 dark:bg-green-700/80",      // level 2
  "bg-green-500 dark:bg-green-600",         // level 3
  "bg-green-700 dark:bg-green-500",         // level 4
] as const;

function getColorLevel(words: number, maxWords: number): number {
  if (words === 0 || maxWords === 0) return 0;
  const ratio = words / maxWords;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.50) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

// ---------------------------------------------------------------------------
// Day names
// ---------------------------------------------------------------------------

const DAY_LABELS = ["Lun", "", "Mer", "", "Ven", "", "Dom"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a map from "YYYY-MM-DD" to CalendarDay for quick lookup. */
function buildDayMap(days: CalendarDay[]): Map<string, CalendarDay> {
  const map = new Map<string, CalendarDay>();
  for (const d of days) {
    map.set(d.date, d);
  }
  return map;
}

/** Generate all days from Jan 1 to Dec 31 of the given year. */
function generateYearDays(year: number): string[] {
  const dates: string[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const d = new Date(start);
  while (d <= end) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

/** Group dates into weeks (columns), starting on Monday. */
function groupIntoWeeks(dates: string[]): (string | null)[][] {
  if (dates.length === 0) return [];

  const firstDay = new Date(dates[0]);
  // getDay() returns 0=Sun, 1=Mon, ..., 6=Sat
  // We want Monday=0, so remap
  const startDow = (firstDay.getDay() + 6) % 7;

  const weeks: (string | null)[][] = [];
  // Pad first week with nulls
  let currentWeek: (string | null)[] = Array.from<null>({ length: startDow }).fill(null);

  for (const date of dates) {
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WritingCalendar({
  projectId,
  year = new Date().getFullYear(),
}: WritingCalendarProps) {
  const { data, isLoading } = useCalendar(projectId, year);
  const [tooltip, setTooltip] = useState<{
    date: string;
    words: number;
    x: number;
    y: number;
  } | null>(null);

  const dayMap = useMemo(() => buildDayMap(data?.days ?? []), [data?.days]);
  const maxWords = useMemo(
    () => Math.max(1, ...Array.from(dayMap.values()).map((d) => d.wordsWritten)),
    [dayMap]
  );

  const yearDates = useMemo(() => generateYearDays(year), [year]);
  const weeks = useMemo(() => groupIntoWeeks(yearDates), [yearDates]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, date: string) => {
      const day = dayMap.get(date);
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const parentRect = (
        e.currentTarget as HTMLElement
      ).closest("[data-calendar-grid]")?.getBoundingClientRect();

      setTooltip({
        date,
        words: day?.wordsWritten ?? 0,
        x: rect.left - (parentRect?.left ?? 0) + rect.width / 2,
        y: rect.top - (parentRect?.top ?? 0) - 8,
      });
    },
    [dayMap]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // --- Loading state ---

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4" />
            Calendario di scrittura
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

  // --- Render ---

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4" />
          Calendario di scrittura {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar grid */}
        <div className="relative overflow-x-auto" data-calendar-grid>
          <div className="flex gap-0.5">
            {/* Day labels column */}
            <div className="flex flex-col gap-0.5 pr-1">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex h-[13px] w-6 items-center justify-end text-[9px] text-gray-400 dark:text-gray-500"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-0.5">
                {week.map((date, dIdx) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${dIdx}`}
                        className="h-[13px] w-[13px]"
                      />
                    );
                  }

                  const day = dayMap.get(date);
                  const words = day?.wordsWritten ?? 0;
                  const level = getColorLevel(words, maxWords);

                  return (
                    <div
                      key={date}
                      className={`h-[13px] w-[13px] rounded-[2px] transition-colors ${COLOR_LEVELS[level]} cursor-pointer hover:ring-1 hover:ring-gray-400 dark:hover:ring-gray-500`}
                      onMouseEnter={(e) => handleMouseEnter(e, date)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border bg-white px-2.5 py-1.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <p className="font-medium">
                {new Date(tooltip.date).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {tooltip.words.toLocaleString("it-IT")} parole
              </p>
            </div>
          )}
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Meno</span>
          {COLOR_LEVELS.map((color, i) => (
            <div
              key={i}
              className={`h-[11px] w-[11px] rounded-[2px] ${color}`}
            />
          ))}
          <span>Più</span>
        </div>

        {/* Streak info */}
        {data && (
          <div className="flex items-center gap-4 border-t pt-3 text-sm dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">
                {data.currentStreak}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {data.currentStreak === 1 ? "giorno consecutivo" : "giorni consecutivi"}
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
      </CardContent>
    </Card>
  );
}
