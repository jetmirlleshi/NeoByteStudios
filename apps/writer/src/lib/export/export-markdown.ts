/**
 * Generate a Markdown string from manuscript chapters.
 */

import { htmlToMarkdown } from "./html-utils";

export interface MarkdownChapter {
  title: string;
  number: number;
  contentHtml: string;
  notes?: string | null;
}

export interface MarkdownParams {
  title: string;
  subtitle?: string | null;
  chapters: MarkdownChapter[];
  includeNotes?: boolean;
}

/**
 * Build a complete Markdown manuscript from project data.
 *
 * Output format:
 * ```
 * # Title
 *
 * *Subtitle*
 *
 * ---
 *
 * ## Capitolo 1 - Chapter Title
 *
 * content...
 *
 * ---
 *
 * ## Capitolo 2 - ...
 * ```
 */
export function generateMarkdown(params: MarkdownParams): string {
  const { title, subtitle, chapters, includeNotes = false } = params;

  const parts: string[] = [];

  // Title
  parts.push(`# ${title}`);

  // Subtitle
  if (subtitle) {
    parts.push(`*${subtitle}*`);
  }

  // Separator after front matter
  parts.push("---");

  // Chapters
  for (const chapter of chapters) {
    // Chapter heading
    parts.push(`## Capitolo ${chapter.number} - ${chapter.title}`);

    // Content
    const content = htmlToMarkdown(chapter.contentHtml);
    if (content) {
      parts.push(content);
    }

    // Notes
    if (includeNotes && chapter.notes) {
      parts.push(`> **Note dell'autore:** ${chapter.notes}`);
    }

    // Separator between chapters
    parts.push("---");
  }

  // Remove the trailing separator
  if (parts[parts.length - 1] === "---") {
    parts.pop();
  }

  return parts.join("\n\n") + "\n";
}
