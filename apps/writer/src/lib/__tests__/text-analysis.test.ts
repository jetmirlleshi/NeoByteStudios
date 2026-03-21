import { describe, it, expect } from "vitest";
import { analyzeText } from "@/lib/analytics/text-analysis";

describe("analyzeText", () => {
  describe("empty input", () => {
    it("should handle empty string", () => {
      const result = analyzeText("");
      expect(result.totalWords).toBe(0);
      expect(result.uniqueWords).toBe(0);
      expect(result.totalSentences).toBe(0);
      expect(result.totalParagraphs).toBe(0);
      expect(result.topWords).toEqual([]);
      expect(result.dialogueRatio).toBe(0);
      expect(result.typeTokenRatio).toBe(0);
    });

    it("should handle whitespace-only string", () => {
      const result = analyzeText("   \n\n  \t  ");
      expect(result.totalWords).toBe(0);
      expect(result.topWords).toEqual([]);
    });

    it("should handle null-like HTML", () => {
      const result = analyzeText("<p></p><div></div>");
      expect(result.totalWords).toBe(0);
    });
  });

  describe("simple Italian text", () => {
    it("should count words correctly in Italian text", () => {
      const text = "Il gatto nero dorme sul divano rosso della casa.";
      const result = analyzeText(text);
      expect(result.totalWords).toBe(9);
      expect(result.totalSentences).toBe(1);
    });

    it("should count multiple sentences", () => {
      const text =
        "Il sole splende. La luna brilla. Le stelle illuminano il cielo.";
      const result = analyzeText(text);
      expect(result.totalSentences).toBe(3);
    });

    it("should count paragraphs from plain text", () => {
      const text = "Primo paragrafo qui.\n\nSecondo paragrafo qui.";
      const result = analyzeText(text);
      expect(result.totalParagraphs).toBeGreaterThanOrEqual(2);
    });

    it("should calculate unique words and type-token ratio", () => {
      const text = "il gatto il gatto il cane";
      const result = analyzeText(text);
      expect(result.totalWords).toBe(6);
      expect(result.uniqueWords).toBe(3);
      expect(result.typeTokenRatio).toBeCloseTo(0.5, 1);
    });
  });

  describe("HTML stripping", () => {
    it("should strip basic HTML tags", () => {
      const html = "<p>Questa è una <strong>frase</strong> di prova.</p>";
      const result = analyzeText(html);
      expect(result.totalWords).toBe(6);
    });

    it("should strip nested HTML tags", () => {
      const html =
        "<div><p>Prima <em>parola</em></p><p>Seconda <strong><em>parola</em></strong></p></div>";
      const result = analyzeText(html);
      expect(result.totalWords).toBeGreaterThanOrEqual(4);
    });

    it("should handle HTML entities", () => {
      const html = "<p>L&rsquo;uomo &egrave; arrivato.</p>";
      const result = analyzeText(html);
      expect(result.totalWords).toBeGreaterThanOrEqual(2);
    });

    it("should count paragraphs from HTML p tags", () => {
      const html =
        "<p>Primo paragrafo.</p><p>Secondo paragrafo.</p><p>Terzo paragrafo.</p>";
      const result = analyzeText(html);
      expect(result.totalParagraphs).toBe(3);
    });

    it("should strip script and style tags entirely", () => {
      const html =
        '<p>Testo visibile.</p><script>alert("ciao")</script><style>.x{color:red}</style>';
      const result = analyzeText(html);
      expect(result.totalWords).toBe(2);
    });
  });

  describe("dialogue detection", () => {
    it("should detect Italian guillemet dialogue", () => {
      const text =
        "Marco disse: \u00ABCiao, come stai?\u00BB e poi se ne and\u00f2.";
      const result = analyzeText(text);
      expect(result.dialogueRatio).toBeGreaterThan(0);
    });

    it("should detect curly-quote dialogue", () => {
      const text =
        "Anna rispose: \u201CNon lo so\u201D con un sorriso. Marco aggiunse: \u201CVa bene\u201D piano.";
      const result = analyzeText(text);
      expect(result.dialogueRatio).toBeGreaterThan(0);
    });

    it("should return 0 dialogue ratio when no dialogue present", () => {
      const text =
        "Il sole tramonta lentamente dietro le colline. Il cielo diventa rosso.";
      const result = analyzeText(text);
      expect(result.dialogueRatio).toBe(0);
    });

    it("should handle mixed dialogue and narration", () => {
      const text = [
        "Era una giornata tranquilla.",
        "\u00ABAndiamo al parco\u00BB disse Maria.",
        "Giovanni annu\u00ec in silenzio.",
        "\u00ABD'accordo, partiamo subito\u00BB rispose.",
      ].join(" ");
      const result = analyzeText(text);
      expect(result.dialogueRatio).toBeGreaterThan(0);
      expect(result.dialogueRatio).toBeLessThan(1);
    });
  });

  describe("stop words exclusion", () => {
    it("should exclude Italian stop words from topWords", () => {
      const text =
        "Il gatto e il cane sono nella casa. Il gatto dorme e il cane gioca nella casa.";
      const result = analyzeText(text);

      const topWordStrings = result.topWords.map((w) => w.word);

      // Common Italian stop words should be excluded
      const stopWords = ["il", "e", "sono", "nella", "di", "che", "la", "un"];
      for (const stopWord of stopWords) {
        expect(topWordStrings).not.toContain(stopWord);
      }
    });

    it("should rank content words by frequency", () => {
      const text =
        "Il gatto nero dorme sul divano. Il gatto bianco dorme sul letto. Il gatto grigio dorme.";
      const result = analyzeText(text);

      const topWordStrings = result.topWords.map((w) => w.word);
      // "gatto" and "dorme" appear 3 times each, should be top words
      expect(topWordStrings).toContain("gatto");
      expect(topWordStrings).toContain("dorme");
    });

    it("should return topWords with correct count structure", () => {
      const text = "Roma Roma Roma Milano Milano Napoli";
      const result = analyzeText(text);

      for (const entry of result.topWords) {
        expect(entry).toHaveProperty("word");
        expect(entry).toHaveProperty("count");
        expect(typeof entry.word).toBe("string");
        expect(typeof entry.count).toBe("number");
        expect(entry.count).toBeGreaterThan(0);
      }
    });
  });

  describe("readability index (Gulpease)", () => {
    it("should return readability index between 0 and 100", () => {
      const text =
        "Il gatto dorme sul divano. La luna brilla nel cielo scuro. Le stelle sono lontane.";
      const result = analyzeText(text);
      expect(result.readabilityIndex).toBeGreaterThanOrEqual(0);
      expect(result.readabilityIndex).toBeLessThanOrEqual(100);
    });

    it("should give higher readability for simple short sentences", () => {
      const simpleText = "Il sole splende. Fa caldo. Io gioco.";
      const complexText =
        "L'implementazione di strategie comunicative necessita di un'attenta valutazione delle dinamiche interpersonali.";

      const simpleResult = analyzeText(simpleText);
      const complexResult = analyzeText(complexText);

      // Simple text should have higher Gulpease (easier to read)
      expect(simpleResult.readabilityIndex).toBeGreaterThan(
        complexResult.readabilityIndex
      );
    });

    it("should handle single sentence for readability", () => {
      const text = "Ciao mondo.";
      const result = analyzeText(text);
      expect(result.readabilityIndex).toBeGreaterThanOrEqual(0);
      expect(result.readabilityIndex).toBeLessThanOrEqual(100);
    });
  });

  describe("sentence statistics", () => {
    it("should calculate sentence statistics correctly", () => {
      const text =
        "Ciao. Questo testo ha frasi di lunghezza diversa. Breve. Una frase un po' più lunga per testare il calcolo.";
      const result = analyzeText(text);

      expect(result.sentenceStats).toHaveProperty("average");
      expect(result.sentenceStats).toHaveProperty("median");
      expect(result.sentenceStats).toHaveProperty("min");
      expect(result.sentenceStats).toHaveProperty("max");
      expect(result.sentenceStats).toHaveProperty("distribution");

      expect(result.sentenceStats.min).toBeLessThanOrEqual(
        result.sentenceStats.average
      );
      expect(result.sentenceStats.average).toBeLessThanOrEqual(
        result.sentenceStats.max
      );
      expect(result.sentenceStats.median).toBeGreaterThanOrEqual(
        result.sentenceStats.min
      );
      expect(result.sentenceStats.median).toBeLessThanOrEqual(
        result.sentenceStats.max
      );
    });

    it("should return zero stats for empty text", () => {
      const result = analyzeText("");
      expect(result.sentenceStats.average).toBe(0);
      expect(result.sentenceStats.median).toBe(0);
      expect(result.sentenceStats.min).toBe(0);
      expect(result.sentenceStats.max).toBe(0);
    });
  });
});
