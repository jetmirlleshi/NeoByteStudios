import { describe, it, expect } from "vitest";
import { stripHtml, htmlToMarkdown } from "@/lib/export/html-utils";

describe("stripHtml", () => {
  it("should return empty string for empty input", () => {
    expect(stripHtml("")).toBe("");
  });

  it("should return plain text unchanged", () => {
    expect(stripHtml("Ciao mondo")).toBe("Ciao mondo");
  });

  it("should strip simple HTML tags", () => {
    expect(stripHtml("<p>Ciao mondo</p>")).toBe("Ciao mondo");
  });

  it("should strip nested HTML tags", () => {
    expect(stripHtml("<div><p><strong>Testo</strong></p></div>")).toBe("Testo");
  });

  it("should strip self-closing tags", () => {
    expect(stripHtml("Prima<br/>Dopo")).toBe("Prima Dopo");
  });

  it("should handle multiple inline elements", () => {
    const html = "<p>Questo è <em>corsivo</em> e <strong>grassetto</strong></p>";
    const result = stripHtml(html);
    expect(result).toContain("corsivo");
    expect(result).toContain("grassetto");
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });

  it("should strip attributes from tags", () => {
    const html = '<a href="https://example.com" class="link">Link testo</a>';
    expect(stripHtml(html)).toBe("Link testo");
  });

  it("should handle script tags", () => {
    const html = '<p>Visibile</p><script>alert("nascosto")</script>';
    const result = stripHtml(html);
    expect(result).toContain("Visibile");
    expect(result).not.toContain("alert");
    expect(result).not.toContain("nascosto");
  });

  it("should handle style tags", () => {
    const html = "<style>.x{color:red}</style><p>Testo</p>";
    const result = stripHtml(html);
    expect(result).toContain("Testo");
    expect(result).not.toContain("color");
  });

  it("should preserve spaces between elements", () => {
    const html = "<span>Prima</span> <span>Dopo</span>";
    const result = stripHtml(html);
    expect(result).toContain("Prima");
    expect(result).toContain("Dopo");
  });

  it("should handle HTML entities", () => {
    const html = "<p>Tom &amp; Jerry &lt;3</p>";
    const result = stripHtml(html);
    expect(result).toContain("Tom");
    expect(result).toContain("Jerry");
  });

  it("should handle complex nested structures", () => {
    const html = `
      <div class="container">
        <h1>Titolo</h1>
        <p>Paragrafo con <a href="#">link</a> e <em>enfasi</em>.</p>
        <ul>
          <li>Elemento uno</li>
          <li>Elemento due</li>
        </ul>
      </div>
    `;
    const result = stripHtml(html);
    expect(result).toContain("Titolo");
    expect(result).toContain("link");
    expect(result).toContain("enfasi");
    expect(result).toContain("Elemento uno");
    expect(result).not.toContain("<");
  });
});

describe("htmlToMarkdown", () => {
  it("should return empty string for empty input", () => {
    expect(htmlToMarkdown("")).toBe("");
  });

  it("should convert h1 tags to markdown heading", () => {
    const result = htmlToMarkdown("<h1>Titolo Principale</h1>");
    expect(result).toContain("# Titolo Principale");
  });

  it("should convert h2 tags to markdown heading", () => {
    const result = htmlToMarkdown("<h2>Sottotitolo</h2>");
    expect(result).toContain("## Sottotitolo");
  });

  it("should convert h3 tags to markdown heading", () => {
    const result = htmlToMarkdown("<h3>Sezione</h3>");
    expect(result).toContain("### Sezione");
  });

  it("should convert bold tags to markdown", () => {
    const result = htmlToMarkdown("<p>Testo <strong>grassetto</strong> qui</p>");
    expect(result).toContain("**grassetto**");
  });

  it("should convert b tags to markdown bold", () => {
    const result = htmlToMarkdown("<p>Testo <b>grassetto</b> qui</p>");
    expect(result).toContain("**grassetto**");
  });

  it("should convert italic em tags to markdown", () => {
    const result = htmlToMarkdown("<p>Testo <em>corsivo</em> qui</p>");
    expect(result).toContain("*corsivo*");
  });

  it("should convert italic i tags to markdown", () => {
    const result = htmlToMarkdown("<p>Testo <i>corsivo</i> qui</p>");
    expect(result).toContain("*corsivo*");
  });

  it("should convert unordered lists", () => {
    const html = "<ul><li>Primo</li><li>Secondo</li><li>Terzo</li></ul>";
    const result = htmlToMarkdown(html);
    expect(result).toContain("- Primo");
    expect(result).toContain("- Secondo");
    expect(result).toContain("- Terzo");
  });

  it("should convert ordered lists", () => {
    const html = "<ol><li>Primo</li><li>Secondo</li><li>Terzo</li></ol>";
    const result = htmlToMarkdown(html);
    expect(result).toContain("1. Primo");
    expect(result).toContain("2. Secondo");
    expect(result).toContain("3. Terzo");
  });

  it("should convert links to markdown", () => {
    const html = '<a href="https://example.com">Vai al sito</a>';
    const result = htmlToMarkdown(html);
    expect(result).toContain("[Vai al sito](https://example.com)");
  });

  it("should convert paragraphs with proper spacing", () => {
    const html = "<p>Primo paragrafo.</p><p>Secondo paragrafo.</p>";
    const result = htmlToMarkdown(html);
    expect(result).toContain("Primo paragrafo.");
    expect(result).toContain("Secondo paragrafo.");
    // Should have line breaks between paragraphs
    const lines = result.split("\n").filter((l: string) => l.trim() !== "");
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle combined formatting", () => {
    const html = `
      <h1>Capitolo 1</h1>
      <p>Questo è un <strong>paragrafo</strong> con <em>formattazione</em>.</p>
      <h2>Sezione 1.1</h2>
      <ul>
        <li>Elemento A</li>
        <li>Elemento B</li>
      </ul>
      <p>Visita <a href="https://example.com">il sito</a> per dettagli.</p>
    `;
    const result = htmlToMarkdown(html);
    expect(result).toContain("# Capitolo 1");
    expect(result).toContain("**paragrafo**");
    expect(result).toContain("*formattazione*");
    expect(result).toContain("## Sezione 1.1");
    expect(result).toContain("- Elemento A");
    expect(result).toContain("[il sito](https://example.com)");
  });

  it("should handle empty tags gracefully", () => {
    const html = "<h1></h1><p></p><ul><li></li></ul>";
    const result = htmlToMarkdown(html);
    // Should not throw and should return something reasonable
    expect(typeof result).toBe("string");
  });

  it("should convert br tags to line breaks", () => {
    const html = "<p>Prima riga<br>Seconda riga</p>";
    const result = htmlToMarkdown(html);
    expect(result).toContain("Prima riga");
    expect(result).toContain("Seconda riga");
  });
});
