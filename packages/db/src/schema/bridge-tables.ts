import { pgTable, text, primaryKey, index } from "drizzle-orm/pg-core";
import { nbwChapters } from "./chapters";
import { nbwCharacters } from "./characters";
import { nbwLocations } from "./worldbuilding";
import { nbwTimelineEvents, nbwSubplots } from "./worldbuilding";
import { nbwWritingSessions } from "./analytics";

// Character <-> Chapter
export const nbwCharacterChapters = pgTable(
  "nbw_character_chapters",
  {
    characterId: text("character_id")
      .notNull()
      .references(() => nbwCharacters.id),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => nbwChapters.id),
    role: text("role"),
    notes: text("notes"),
  },
  (table) => [
    primaryKey({ columns: [table.characterId, table.chapterId] }),
    index("nbw_character_chapters_chapter_idx").on(table.chapterId),
  ]
);

// Location <-> Chapter
export const nbwLocationChapters = pgTable(
  "nbw_location_chapters",
  {
    locationId: text("location_id")
      .notNull()
      .references(() => nbwLocations.id),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => nbwChapters.id),
    notes: text("notes"),
  },
  (table) => [
    primaryKey({ columns: [table.locationId, table.chapterId] }),
    index("nbw_location_chapters_chapter_idx").on(table.chapterId),
  ]
);

// TimelineEvent <-> Character
export const nbwTimelineEventCharacters = pgTable(
  "nbw_timeline_event_characters",
  {
    timelineEventId: text("timeline_event_id")
      .notNull()
      .references(() => nbwTimelineEvents.id),
    characterId: text("character_id")
      .notNull()
      .references(() => nbwCharacters.id),
  },
  (table) => [
    primaryKey({ columns: [table.timelineEventId, table.characterId] }),
    index("nbw_timeline_event_characters_char_idx").on(table.characterId),
  ]
);

// TimelineEvent <-> Location
export const nbwTimelineEventLocations = pgTable(
  "nbw_timeline_event_locations",
  {
    timelineEventId: text("timeline_event_id")
      .notNull()
      .references(() => nbwTimelineEvents.id),
    locationId: text("location_id")
      .notNull()
      .references(() => nbwLocations.id),
  },
  (table) => [
    primaryKey({ columns: [table.timelineEventId, table.locationId] }),
    index("nbw_timeline_event_locations_loc_idx").on(table.locationId),
  ]
);

// Subplot <-> Character
export const nbwSubplotCharacters = pgTable(
  "nbw_subplot_characters",
  {
    subplotId: text("subplot_id")
      .notNull()
      .references(() => nbwSubplots.id),
    characterId: text("character_id")
      .notNull()
      .references(() => nbwCharacters.id),
  },
  (table) => [
    primaryKey({ columns: [table.subplotId, table.characterId] }),
    index("nbw_subplot_characters_char_idx").on(table.characterId),
  ]
);

// Subplot <-> Chapter
export const nbwSubplotChapters = pgTable(
  "nbw_subplot_chapters",
  {
    subplotId: text("subplot_id")
      .notNull()
      .references(() => nbwSubplots.id),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => nbwChapters.id),
  },
  (table) => [
    primaryKey({ columns: [table.subplotId, table.chapterId] }),
    index("nbw_subplot_chapters_chapter_idx").on(table.chapterId),
  ]
);

// WritingSession <-> Chapter
export const nbwWritingSessionChapters = pgTable(
  "nbw_writing_session_chapters",
  {
    sessionId: text("session_id")
      .notNull()
      .references(() => nbwWritingSessions.id),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => nbwChapters.id),
  },
  (table) => [
    primaryKey({ columns: [table.sessionId, table.chapterId] }),
  ]
);
