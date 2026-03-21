/**
 * HTML utility functions for export conversions.
 *
 * stripHtml  - remove all tags and decode common entities
 * htmlToMarkdown - convert basic HTML to Markdown
 */

// ---- Entity map for decoding HTML entities ----
const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
  "&hellip;": "\u2026",
  "&lsquo;": "\u2018",
  "&rsquo;": "\u2019",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
};

function decodeEntities(text: string): string {
  // Named entities
  let result = text.replace(
    /&(?:amp|lt|gt|quot|apos|nbsp|mdash|ndash|hellip|lsquo|rsquo|ldquo|rdquo|#39);/gi,
    (match) => ENTITY_MAP[match.toLowerCase()] ?? match
  );
  // Numeric entities  &#123;  &#x1F;
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code))
  );
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return result;
}

// ---- Scene separator detection ----
const SCENE_SEPARATOR_REGEX =
  /^[\s]*(?:\*\s*\*\s*\*|---+|___+|[*]{3,}|[#]{3,}\s*$)/;

function isSceneSeparator(text: string): boolean {
  return SCENE_SEPARATOR_REGEX.test(text.trim());
}

// ---- stripHtml ----

/**
 * Remove all HTML tags from a string and decode entities.
 * Preserves line breaks by converting block-level elements to newlines.
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  let text = html;

  // Replace <br> variants with newlines
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Block-level elements get newlines before/after
  text = text.replace(/<\/(?:p|div|h[1-6]|li|tr|blockquote)>/gi, "\n");
  text = text.replace(/<(?:p|div|h[1-6]|li|tr|blockquote|hr)[\s>]/gi, "\n");

  // Remove all remaining tags
  text = text.replace(/<[^>]*>/g, "");

  // Decode entities
  text = decodeEntities(text);

  // Collapse multiple blank lines to max two
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

// ---- htmlToMarkdown ----

/**
 * Convert basic HTML to Markdown.
 *
 * Supported elements:
 * - <h1>...<h6> -> # ... ######
 * - <p> -> paragraph text + double newline
 * - <strong>/<b> -> **text**
 * - <em>/<i> -> *text*
 * - <br> -> newline
 * - <ul>/<ol>/<li> -> - item / 1. item
 * - <blockquote> -> > text
 * - <hr> / scene separators -> * * *
 * - <a href="..."> -> [text](url)
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return "";

  let md = html;

  // --- Scene separators (custom div or hr) ---
  md = md.replace(/<hr\s*\/?>/gi, "\n\n* * *\n\n");

  // --- Headings ---
  for (let level = 6; level >= 1; level--) {
    const prefix = "#".repeat(level);
    const re = new RegExp(
      `<h${level}[^>]*>(.*?)<\\/h${level}>`,
      "gis"
    );
    md = md.replace(re, (_match, content: string) => {
      const clean = stripInlineTags(content).trim();
      return `\n\n${prefix} ${clean}\n\n`;
    });
  }

  // --- Blockquote ---
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner: string) => {
    const text = stripInlineTags(inner).trim();
    const lines = text.split("\n").map((l) => `> ${l.trim()}`);
    return `\n\n${lines.join("\n")}\n\n`;
  });

  // --- Lists ---
  // Ordered list items: track counter
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_m, inner: string) => {
    let counter = 0;
    const items = inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_li, content: string) => {
      counter++;
      return `${counter}. ${stripInlineTags(content).trim()}\n`;
    });
    return `\n\n${stripRemainingTags(items).trim()}\n\n`;
  });

  // Unordered list items
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_m, inner: string) => {
    const items = inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_li, content: string) => {
      return `- ${stripInlineTags(content).trim()}\n`;
    });
    return `\n\n${stripRemainingTags(items).trim()}\n\n`;
  });

  // Remaining <li> outside of ul/ol
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, content: string) => {
    return `- ${stripInlineTags(content).trim()}\n`;
  });

  // --- Links ---
  md = md.replace(
    /<a\s[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href: string, text: string) => {
      const clean = stripInlineTags(text).trim();
      return `[${clean}](${href})`;
    }
  );

  // --- Inline formatting (must happen before paragraph stripping) ---
  md = md.replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**");
  md = md.replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*");
  md = md.replace(/<(?:u)>([\s\S]*?)<\/(?:u)>/gi, "$1");
  md = md.replace(/<(?:s|strike|del)>([\s\S]*?)<\/(?:s|strike|del)>/gi, "~~$1~~");
  md = md.replace(/<(?:code)>([\s\S]*?)<\/(?:code)>/gi, "`$1`");

  // --- Paragraphs ---
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m, content: string) => {
    const text = content.trim();
    // If the paragraph content is a scene separator, render as * * *
    if (isSceneSeparator(stripRemainingTags(text))) {
      return "\n\n* * *\n\n";
    }
    return `\n\n${text}\n\n`;
  });

  // --- Line breaks ---
  md = md.replace(/<br\s*\/?>/gi, "\n");

  // --- Divs (treat as block) ---
  md = md.replace(/<\/?div[^>]*>/gi, "\n");

  // --- Strip remaining tags ---
  md = stripRemainingTags(md);

  // --- Decode entities ---
  md = decodeEntities(md);

  // --- Cleanup whitespace ---
  // Collapse 3+ newlines to 2
  md = md.replace(/\n{3,}/g, "\n\n");
  // Remove trailing spaces on lines
  md = md
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  return md.trim();
}

// ---- Internal helpers ----

/** Strip inline-level tags but keep their text content */
function stripInlineTags(html: string): string {
  return html
    .replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/gi, "$1")
    .replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/gi, "$1")
    .replace(/<(?:u)>([\s\S]*?)<\/(?:u)>/gi, "$1")
    .replace(/<(?:s|strike|del)>([\s\S]*?)<\/(?:s|strike|del)>/gi, "$1")
    .replace(/<(?:code)>([\s\S]*?)<\/(?:code)>/gi, "$1")
    .replace(/<a\s[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "");
}

/** Remove any remaining HTML tags */
function stripRemainingTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
