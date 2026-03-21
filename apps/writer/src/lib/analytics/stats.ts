import {
  db,
  nbwProjects,
  nbwChapters,
  nbwCharacters,
  nbwCoherenceAlerts,
  nbwDailyStats,
  nbwWritingSessions,
  eq,
  and,
  isNull,
  sql,
  count,
  gte,
  lte,
  desc,
  asc,
} from "@neobytestudios/db";

// ---------- getProjectStats ----------

export interface ProjectStats {
  totalWords: number;
  totalChapters: number;
  chaptersByStatus: Record<string, number>;
  characterCount: number;
  activeAlertsCount: number;
  todayWords: number;
  weeklyWords: number;
  currentStreak: number;
  targetWordCount: number;
  targetChapters: number;
  deadline: Date | null;
}

export async function getProjectStats(
  projectId: string
): Promise<ProjectStats> {
  // Fetch project targets
  const [project] = await db
    .select({
      targetWordCount: nbwProjects.targetWordCount,
      targetChapters: nbwProjects.targetChapters,
      deadline: nbwProjects.deadline,
    })
    .from(nbwProjects)
    .where(eq(nbwProjects.id, projectId));

  // Total words and chapter count
  const [chapterAgg] = await db
    .select({
      totalWords: sql<number>`coalesce(sum(${nbwChapters.wordCount}), 0)`,
      totalChapters: count(nbwChapters.id),
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    );

  // Chapters by status
  const statusRows = await db
    .select({
      status: nbwChapters.status,
      count: count(nbwChapters.id),
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    )
    .groupBy(nbwChapters.status);

  const chaptersByStatus: Record<string, number> = {};
  for (const row of statusRows) {
    chaptersByStatus[row.status] = Number(row.count);
  }

  // Character count
  const [charAgg] = await db
    .select({ characterCount: count(nbwCharacters.id) })
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  // Active coherence alerts
  const [alertAgg] = await db
    .select({ activeAlertsCount: count(nbwCoherenceAlerts.id) })
    .from(nbwCoherenceAlerts)
    .where(
      and(
        eq(nbwCoherenceAlerts.projectId, projectId),
        eq(nbwCoherenceAlerts.status, "OPEN")
      )
    );

  // Today's and weekly word counts from daily stats
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const weekAgo = new Date(todayStart);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const [todayAgg] = await db
    .select({
      todayWords: sql<number>`coalesce(sum(${nbwDailyStats.wordsWritten}), 0)`,
    })
    .from(nbwDailyStats)
    .where(
      and(
        eq(nbwDailyStats.projectId, projectId),
        gte(nbwDailyStats.date, todayStart),
        lte(nbwDailyStats.date, now)
      )
    );

  const [weekAgg] = await db
    .select({
      weeklyWords: sql<number>`coalesce(sum(${nbwDailyStats.wordsWritten}), 0)`,
    })
    .from(nbwDailyStats)
    .where(
      and(
        eq(nbwDailyStats.projectId, projectId),
        gte(nbwDailyStats.date, weekAgo),
        lte(nbwDailyStats.date, now)
      )
    );

  // Current streak: consecutive days with >0 words (counting backwards)
  const streakRows = await db
    .select({
      date: nbwDailyStats.date,
      wordsWritten: nbwDailyStats.wordsWritten,
    })
    .from(nbwDailyStats)
    .where(eq(nbwDailyStats.projectId, projectId))
    .orderBy(desc(nbwDailyStats.date));

  let currentStreak = 0;
  const checkDate = new Date(todayStart);

  for (const row of streakRows) {
    const rowDate = new Date(row.date);
    const rowDateStart = new Date(
      rowDate.getFullYear(),
      rowDate.getMonth(),
      rowDate.getDate()
    );

    // Skip future dates
    if (rowDateStart > checkDate) continue;

    // If this date matches and has words, increment streak
    if (
      rowDateStart.getTime() === checkDate.getTime() &&
      row.wordsWritten > 0
    ) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (rowDateStart.getTime() === checkDate.getTime()) {
      // Date matches but 0 words — streak broken
      break;
    } else if (rowDateStart < checkDate) {
      // Gap in dates — streak broken
      break;
    }
  }

  return {
    totalWords: Number(chapterAgg?.totalWords ?? 0),
    totalChapters: Number(chapterAgg?.totalChapters ?? 0),
    chaptersByStatus,
    characterCount: Number(charAgg?.characterCount ?? 0),
    activeAlertsCount: Number(alertAgg?.activeAlertsCount ?? 0),
    todayWords: Number(todayAgg?.todayWords ?? 0),
    weeklyWords: Number(weekAgg?.weeklyWords ?? 0),
    currentStreak,
    targetWordCount: project?.targetWordCount ?? 80000,
    targetChapters: project?.targetChapters ?? 24,
    deadline: project?.deadline ?? null,
  };
}

// ---------- getDailyProgress ----------

export interface DailyProgressEntry {
  date: string;
  wordsWritten: number;
  cumulativeWords: number;
}

export async function getDailyProgress(
  projectId: string,
  days: number
): Promise<DailyProgressEntry[]> {
  const now = new Date();
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  startDate.setDate(startDate.getDate() - days + 1);

  const rows = await db
    .select({
      date: nbwDailyStats.date,
      wordsWritten: nbwDailyStats.wordsWritten,
    })
    .from(nbwDailyStats)
    .where(
      and(
        eq(nbwDailyStats.projectId, projectId),
        gte(nbwDailyStats.date, startDate)
      )
    )
    .orderBy(asc(nbwDailyStats.date));

  // Build a map of date -> wordsWritten
  const dateMap = new Map<string, number>();
  for (const row of rows) {
    const d = new Date(row.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dateMap.set(key, (dateMap.get(key) ?? 0) + row.wordsWritten);
  }

  // Fill all days in the range
  const result: DailyProgressEntry[] = [];
  let cumulative = 0;
  const current = new Date(startDate);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  while (current <= endDate) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    const wordsWritten = dateMap.get(key) ?? 0;
    cumulative += wordsWritten;
    result.push({ date: key, wordsWritten, cumulativeWords: cumulative });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

// ---------- getCalendarData ----------

export interface CalendarEntry {
  date: string;
  wordsWritten: number;
}

export interface CalendarData {
  entries: CalendarEntry[];
  longestStreak: number;
  totalActiveDays: number;
  totalWords: number;
}

export async function getCalendarData(
  projectId: string,
  year: number
): Promise<CalendarData> {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

  const rows = await db
    .select({
      date: nbwDailyStats.date,
      wordsWritten: nbwDailyStats.wordsWritten,
    })
    .from(nbwDailyStats)
    .where(
      and(
        eq(nbwDailyStats.projectId, projectId),
        gte(nbwDailyStats.date, yearStart),
        lte(nbwDailyStats.date, yearEnd)
      )
    )
    .orderBy(asc(nbwDailyStats.date));

  // Build a map of date -> wordsWritten
  const dateMap = new Map<string, number>();
  for (const row of rows) {
    const d = new Date(row.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dateMap.set(key, (dateMap.get(key) ?? 0) + row.wordsWritten);
  }

  // Fill all 365/366 days
  const entries: CalendarEntry[] = [];
  const current = new Date(yearStart);
  let longestStreak = 0;
  let currentStreak = 0;
  let totalActiveDays = 0;
  let totalWords = 0;

  while (current <= yearEnd) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    const wordsWritten = dateMap.get(key) ?? 0;
    entries.push({ date: key, wordsWritten });

    if (wordsWritten > 0) {
      currentStreak++;
      totalActiveDays++;
      totalWords += wordsWritten;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }

    current.setDate(current.getDate() + 1);
  }

  return { entries, longestStreak, totalActiveDays, totalWords };
}

// ---------- getCharacterAnalytics ----------

export interface CharacterAnalyticsEntry {
  id: string;
  name: string;
  role: string;
  appearances: number;
  povCount: number;
  isUnused: boolean;
}

export async function getCharacterAnalytics(
  projectId: string
): Promise<CharacterAnalyticsEntry[]> {
  // Fetch all non-deleted characters
  const characters = await db
    .select({
      id: nbwCharacters.id,
      name: nbwCharacters.name,
      role: nbwCharacters.role,
    })
    .from(nbwCharacters)
    .where(
      and(
        eq(nbwCharacters.projectId, projectId),
        isNull(nbwCharacters.deletedAt)
      )
    );

  if (characters.length === 0) return [];

  // Fetch all non-deleted chapters with content and pov
  const chapters = await db
    .select({
      contentHtml: nbwChapters.contentHtml,
      pov: nbwChapters.pov,
    })
    .from(nbwChapters)
    .where(
      and(
        eq(nbwChapters.projectId, projectId),
        isNull(nbwChapters.deletedAt)
      )
    );

  const results: CharacterAnalyticsEntry[] = [];

  for (const char of characters) {
    let appearances = 0;
    let povCount = 0;
    const nameLower = char.name.toLowerCase();

    for (const ch of chapters) {
      // Check if character name appears in chapter content
      const contentLower = (ch.contentHtml ?? "").toLowerCase();
      if (contentLower.includes(nameLower)) {
        appearances++;
      }

      // Check if chapter POV matches character name
      if (ch.pov && ch.pov.toLowerCase() === nameLower) {
        povCount++;
      }
    }

    results.push({
      id: char.id,
      name: char.name,
      role: char.role,
      appearances,
      povCount,
      isUnused: appearances === 0 && povCount === 0,
    });
  }

  return results;
}
