/**
 * Generate a DOCX file buffer from manuscript chapters.
 *
 * Uses the `docx` library (v9) with dynamic import to keep
 * the server bundle lean when the function is not called.
 */

import { stripHtml } from "./html-utils";

// ---- Types ----

export interface DocxChapter {
  title: string;
  number: number;
  contentHtml: string;
  notes?: string | null;
}

export interface DocxOptions {
  /** Font family. Default: "Times New Roman" */
  font?: string;
  /** Font size in pt. Default: 12 */
  fontSize?: number;
  /** Line spacing multiplier. Default: 1.5 */
  lineSpacing?: number;
  /** Page margins preset. Default: "normal" */
  margins?: "normal" | "wide" | "narrow";
  /** Include chapter notes as footnotes. Default: false */
  includeNotes?: boolean;
  /** Include chapters in IDEA/OUTLINE status. Default: false */
  includeDrafts?: boolean;
  /** Generate a title page. Default: true */
  titlePage?: boolean;
}

export interface DocxParams {
  title: string;
  subtitle?: string | null;
  author: string;
  chapters: DocxChapter[];
  options: DocxOptions;
}

// ---- Margin presets (in twips, 1 inch = 1440 twips) ----
const MARGIN_PRESETS = {
  normal: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  wide: { top: 1440, right: 2160, bottom: 1440, left: 2160 },
  narrow: { top: 720, right: 720, bottom: 720, left: 720 },
} as const;

// ---- Scene separator regex (detects ***, ---, ___ etc.) ----
const SCENE_SEP_REGEX = /^[\s]*(?:\*\s*\*\s*\*|---+|___+|[*]{3,})[\s]*$/;

// ---- HTML block parser ----

interface ContentBlock {
  type: "paragraph" | "heading" | "separator" | "list-item";
  text: string;
  headingLevel?: number;
  bold?: boolean;
  italic?: boolean;
}

/**
 * Parse contentHtml into a flat array of content blocks.
 * This is intentionally simple: it handles common TipTap output.
 */
function parseHtmlToBlocks(html: string): ContentBlock[] {
  if (!html) return [];

  const blocks: ContentBlock[] = [];

  // Split by block-level tags
  // Match <p>, <h1>-<h6>, <hr>, <li>, <blockquote>, <div>
  const blockRegex =
    /<(h[1-6]|p|li|blockquote|div|hr)[^>]*>([\s\S]*?)<\/\1>|<hr\s*\/?>/gi;

  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(html)) !== null) {
    const tag = (match[1] ?? "hr").toLowerCase();
    const inner = match[2] ?? "";

    if (tag === "hr") {
      blocks.push({ type: "separator", text: "* * *" });
      continue;
    }

    // Strip tags for plain text, but detect bold/italic wrapping
    const plainText = stripHtml(inner).trim();

    if (!plainText) continue;

    // Check for scene separator in paragraph content
    if (SCENE_SEP_REGEX.test(plainText)) {
      blocks.push({ type: "separator", text: "* * *" });
      continue;
    }

    if (tag.startsWith("h")) {
      const level = parseInt(tag[1], 10);
      blocks.push({ type: "heading", text: plainText, headingLevel: level });
    } else if (tag === "li") {
      blocks.push({ type: "list-item", text: plainText });
    } else {
      // Detect if entire paragraph is bold or italic
      const isBold = /^<(?:strong|b)>/i.test(inner.trim()) &&
        /<\/(?:strong|b)>$/i.test(inner.trim());
      const isItalic = /^<(?:em|i)>/i.test(inner.trim()) &&
        /<\/(?:em|i)>$/i.test(inner.trim());

      blocks.push({
        type: "paragraph",
        text: plainText,
        bold: isBold,
        italic: isItalic,
      });
    }
  }

  // If the regex found nothing, treat the whole HTML as a single paragraph
  if (blocks.length === 0) {
    const fallback = stripHtml(html).trim();
    if (fallback) {
      blocks.push({ type: "paragraph", text: fallback });
    }
  }

  return blocks;
}

// ---- Main export function ----

export async function generateDocx(params: DocxParams): Promise<Buffer> {
  // Dynamic import to keep server bundle small
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    PageBreak,
    SectionType,
    Header,
    Footer,
    PageNumber,
    NumberFormat,
    convertInchesToTwip,
  } = await import("docx");

  const {
    title,
    subtitle,
    author,
    chapters,
    options,
  } = params;

  const font = options.font ?? "Times New Roman";
  const fontSize = options.fontSize ?? 12;
  // docx uses half-points for font size
  const fontSizeHalfPt = fontSize * 2;
  const lineSpacing = options.lineSpacing ?? 1.5;
  // docx line spacing is in 240ths of a line (240 = single)
  const lineSpacingValue = Math.round(lineSpacing * 240);
  const margins = MARGIN_PRESETS[options.margins ?? "normal"];
  const includeTitlePage = options.titlePage !== false;
  const includeNotes = options.includeNotes === true;

  // ---- Build sections ----
  // Use a plain array; we'll pass it to the Document constructor at the end.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections: any[] = [];

  // -- Title page section --
  if (includeTitlePage) {
    const titlePageChildren: InstanceType<typeof Paragraph>[] = [];

    // Spacer at the top
    titlePageChildren.push(
      new Paragraph({
        spacing: { before: 4800 },
        children: [],
      })
    );

    // Title
    titlePageChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            font,
            size: fontSizeHalfPt + 16, // title is bigger
          }),
        ],
      })
    );

    // Subtitle
    if (subtitle) {
      titlePageChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: subtitle,
              italics: true,
              font,
              size: fontSizeHalfPt + 8,
            }),
          ],
        })
      );
    }

    // Author
    titlePageChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 },
        children: [
          new TextRun({
            text: author,
            font,
            size: fontSizeHalfPt + 4,
          }),
        ],
      })
    );

    sections.push({
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { margin: margins },
        titlePage: true,
      },
      children: titlePageChildren,
    });
  }

  // -- TOC placeholder section --
  const tocChildren: InstanceType<typeof Paragraph>[] = [];

  tocChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "Table of Contents",
          bold: true,
          font,
          size: fontSizeHalfPt + 8,
        }),
      ],
    })
  );

  // List chapters as simple entries
  for (const chapter of chapters) {
    tocChildren.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `Capitolo ${chapter.number} - ${chapter.title}`,
            font,
            size: fontSizeHalfPt,
          }),
        ],
      })
    );
  }

  sections.push({
    properties: {
      type: SectionType.NEXT_PAGE,
      page: { margin: margins },
    },
    children: tocChildren,
  });

  // -- Chapter sections --
  for (const chapter of chapters) {
    const chapterChildren: InstanceType<typeof Paragraph>[] = [];

    // Chapter heading
    chapterChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 400 },
        children: [
          new TextRun({
            text: `Capitolo ${chapter.number} - ${chapter.title}`,
            bold: true,
            font,
            size: fontSizeHalfPt + 8,
          }),
        ],
      })
    );

    // Parse content
    const blocks = parseHtmlToBlocks(chapter.contentHtml);

    for (const block of blocks) {
      if (block.type === "separator") {
        chapterChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 400 },
            children: [
              new TextRun({
                text: "* * *",
                font,
                size: fontSizeHalfPt,
              }),
            ],
          })
        );
      } else if (block.type === "heading") {
        const headingLevels: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
          1: HeadingLevel.HEADING_1,
          2: HeadingLevel.HEADING_2,
          3: HeadingLevel.HEADING_3,
          4: HeadingLevel.HEADING_4,
          5: HeadingLevel.HEADING_5,
          6: HeadingLevel.HEADING_6,
        };
        chapterChildren.push(
          new Paragraph({
            heading: headingLevels[block.headingLevel ?? 2] ?? HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: block.text,
                bold: true,
                font,
                size: fontSizeHalfPt + (6 - (block.headingLevel ?? 2)) * 2,
              }),
            ],
          })
        );
      } else if (block.type === "list-item") {
        chapterChildren.push(
          new Paragraph({
            spacing: { after: 60 },
            indent: { left: convertInchesToTwip(0.5) },
            children: [
              new TextRun({
                text: `\u2022 ${block.text}`,
                font,
                size: fontSizeHalfPt,
              }),
            ],
          })
        );
      } else {
        // Regular paragraph
        chapterChildren.push(
          new Paragraph({
            spacing: {
              after: 120,
              line: lineSpacingValue,
            },
            indent: { firstLine: convertInchesToTwip(0.3) },
            children: [
              new TextRun({
                text: block.text,
                bold: block.bold,
                italics: block.italic,
                font,
                size: fontSizeHalfPt,
              }),
            ],
          })
        );
      }
    }

    // Chapter notes
    if (includeNotes && chapter.notes) {
      chapterChildren.push(
        new Paragraph({
          spacing: { before: 600, after: 120 },
          children: [
            new TextRun({
              text: "Note dell'autore:",
              bold: true,
              italics: true,
              font,
              size: fontSizeHalfPt - 2,
              color: "666666",
            }),
          ],
        })
      );
      chapterChildren.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: chapter.notes,
              italics: true,
              font,
              size: fontSizeHalfPt - 2,
              color: "666666",
            }),
          ],
        })
      );
    }

    sections.push({
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          margin: margins,
          pageNumbers: { start: undefined },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `${title} - Capitolo ${chapter.number}`,
                  font,
                  size: fontSizeHalfPt - 4,
                  color: "999999",
                  italics: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font,
                  size: fontSizeHalfPt - 4,
                }),
              ],
            }),
          ],
        }),
      },
      children: chapterChildren,
    });
  }

  // ---- Create document ----
  const doc = new Document({
    creator: author,
    title,
    description: subtitle ?? undefined,
    styles: {
      default: {
        document: {
          run: {
            font,
            size: fontSizeHalfPt,
          },
          paragraph: {
            spacing: { line: lineSpacingValue },
          },
        },
      },
    },
    sections,
  });

  // ---- Pack to buffer ----
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
