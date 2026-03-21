// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChunkResult {
  /** The text content of this chunk */
  content: string;
  /** Zero-based index of this chunk in the sequence */
  index: number;
  /** Start character offset within the original text */
  startOffset: number;
  /** End character offset within the original text (exclusive) */
  endOffset: number;
}

export interface ChunkOptions {
  /** Target chunk size in characters (default 2000, ~500 tokens) */
  targetSize?: number;
  /** Overlap in characters between consecutive chunks (default 100) */
  overlap?: number;
}

// ---------------------------------------------------------------------------
// Splitting patterns (ordered by priority)
// ---------------------------------------------------------------------------

/**
 * Scene separators: lines consisting only of `***`, `---`, or `===`
 * (with optional surrounding whitespace).
 */
const SCENE_SEPARATOR_RE = /\n[ \t]*(?:\*{3,}|-{3,}|={3,})[ \t]*\n/;

/** Double newline — paragraph boundaries */
const PARAGRAPH_RE = /\n\n+/;

/** Single newline */
const LINE_RE = /\n/;

/** Sentence endings followed by a space (`. ` / `! ` / `? `) */
const SENTENCE_RE = /(?<=[.!?])\s+/;

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Split `text` into semantically-aware chunks.
 *
 * Splitting priority:
 * 1. Scene separator (`***` / `---` / `===`)
 * 2. Double newline (paragraph)
 * 3. Single newline
 * 4. Sentence boundary (`. ` / `! ` / `? `)
 * 5. Hard split at `targetSize`
 *
 * Each chunk targets `targetSize` characters. Consecutive chunks overlap by
 * `overlap` characters to preserve context across boundaries.
 */
export function chunkText(
  text: string,
  opts?: ChunkOptions
): ChunkResult[] {
  const targetSize = opts?.targetSize ?? 2000;
  const overlap = opts?.overlap ?? 100;

  if (text.length === 0) return [];

  // If the entire text fits in one chunk, return it directly
  if (text.length <= targetSize) {
    return [
      {
        content: text,
        index: 0,
        startOffset: 0,
        endOffset: text.length,
      },
    ];
  }

  const chunks: ChunkResult[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    // Determine the end of the window we'll look in
    const windowEnd = Math.min(cursor + targetSize, text.length);

    // If the remaining text fits, take it all
    if (windowEnd === text.length) {
      chunks.push({
        content: text.slice(cursor),
        index: chunks.length,
        startOffset: cursor,
        endOffset: text.length,
      });
      break;
    }

    // Find the best split point inside [cursor, windowEnd]
    const window = text.slice(cursor, windowEnd);
    const splitOffset = findBestSplit(window);
    const splitAt = cursor + splitOffset;

    chunks.push({
      content: text.slice(cursor, splitAt),
      index: chunks.length,
      startOffset: cursor,
      endOffset: splitAt,
    });

    // Move cursor forward, applying overlap
    cursor = Math.max(splitAt - overlap, cursor + 1);
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Given a `window` string, find the best character offset to split at.
 * Prefers splits at semantic boundaries (scene > paragraph > line > sentence).
 * Falls back to the full window length (hard split) if nothing is found.
 */
function findBestSplit(window: string): number {
  // Try each pattern from highest to lowest priority
  const patterns = [
    SCENE_SEPARATOR_RE,
    PARAGRAPH_RE,
    LINE_RE,
    SENTENCE_RE,
  ];

  for (const pattern of patterns) {
    const pos = findLastMatch(window, pattern);
    // Only accept if the split is in the second half of the window
    // (we don't want tiny chunks)
    if (pos !== -1 && pos >= window.length * 0.3) {
      return pos;
    }
  }

  // Hard split — take the whole window
  return window.length;
}

/**
 * Find the starting offset of the last match of `re` in `text`.
 * Returns -1 if not found.
 */
function findLastMatch(text: string, re: RegExp): number {
  const global = new RegExp(re.source, "g");
  let last = -1;
  let match: RegExpExecArray | null;

  while ((match = global.exec(text)) !== null) {
    // Set the split point at the end of the separator (so the separator
    // stays with the preceding chunk).
    last = match.index + match[0].length;
  }

  return last;
}
