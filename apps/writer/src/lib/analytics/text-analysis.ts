// Italian text analysis utilities for NeoByteWriter

// ~120 common Italian stop words
const ITALIAN_STOP_WORDS = new Set([
  "il", "lo", "la", "le", "gli", "i", "un", "uno", "una",
  "di", "del", "dello", "della", "delle", "dei", "degli",
  "a", "al", "allo", "alla", "alle", "ai", "agli",
  "da", "dal", "dallo", "dalla", "dalle", "dai", "dagli",
  "in", "nel", "nello", "nella", "nelle", "nei", "negli",
  "con", "col", "su", "sul", "sullo", "sulla", "sulle", "sui", "sugli",
  "per", "tra", "fra",
  "che", "chi", "cui", "quale", "quali",
  "e", "ed", "o", "od", "ma", "se", "non", "come", "anche",
  "mi", "ti", "si", "ci", "vi", "ne", "lo", "la", "li", "le",
  "me", "te", "lui", "lei", "noi", "voi", "loro", "esso", "essa",
  "questo", "questa", "questi", "queste",
  "quello", "quella", "quelli", "quelle",
  "mio", "mia", "miei", "mie", "tuo", "tua", "tuoi", "tue",
  "suo", "sua", "suoi", "sue", "nostro", "nostra", "nostri", "nostre",
  "vostro", "vostra", "vostri", "vostre",
  "essere", "avere", "fare", "dire", "andare", "potere", "volere",
  "dovere", "sapere", "vedere", "dare", "stare", "venire",
  "sono", "sei", "siamo", "siete", "hanno", "ha", "ho", "hai",
  "era", "ero", "eri", "eravamo", "eravate", "erano",
  "stato", "stata", "stati", "state",
  "fatto", "detto", "molto", "più", "già", "ancora", "sempre",
  "mai", "solo", "proprio", "tutto", "tutti", "tutta", "tutte",
  "altro", "altra", "altri", "altre", "ogni", "qualche",
  "quando", "dove", "perché", "così", "qui", "là",
  "poi", "ora", "prima", "dopo", "sopra", "sotto",
  "dentro", "fuori", "senza", "verso", "fino",
  "mentre", "però", "quindi", "dunque", "allora", "oppure",
]);

// Strip HTML tags from text
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Tokenize text into words (lowercased, only alphabetic)
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zA-ZàèéìòùÀÈÉÌÒÙáíóúÁÍÓÚâêîôûÂÊÎÔÛäëïöüÄËÏÖÜ]+/)
    .filter((w) => w.length > 1);
}

// Split text into sentences
function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Count letters (non-space, non-punctuation characters)
function countLetters(text: string): number {
  return text.replace(/[^a-zA-ZàèéìòùÀÈÉÌÒÙáíóúÁÍÓÚâêîôûÂÊÎÔÛäëïöüÄËÏÖÜ]/g, "").length;
}

// Calculate median of a number array
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export interface TextAnalysisResult {
  topWords: Array<{ word: string; count: number }>;
  sentenceStats: {
    avg: number;
    median: number;
    min: number;
    max: number;
    distribution: {
      short: number;   // <= 10 words
      medium: number;  // 11-25 words
      long: number;    // > 25 words
    };
  };
  dialogueRatio: number;
  gulpease: number;
  typeTokenRatio: number;
}

export function analyzeText(html: string): TextAnalysisResult {
  const text = stripHtml(html);
  const words = tokenize(text);
  const sentences = splitSentences(text);

  // --- Top words (excluding stop words) ---
  const wordFreq = new Map<string, number>();
  for (const word of words) {
    if (!ITALIAN_STOP_WORDS.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) ?? 0) + 1);
    }
  }
  const topWords = [...wordFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word, count]) => ({ word, count }));

  // --- Sentence stats ---
  const sentenceWordCounts = sentences.map(
    (s) => s.split(/\s+/).filter((w) => w.length > 0).length
  );

  let short = 0;
  let medium = 0;
  let long = 0;
  for (const wc of sentenceWordCounts) {
    if (wc <= 10) short++;
    else if (wc <= 25) medium++;
    else long++;
  }

  const totalSentenceWords = sentenceWordCounts.reduce((a, b) => a + b, 0);
  const sentenceStats = {
    avg: sentenceWordCounts.length > 0
      ? Math.round((totalSentenceWords / sentenceWordCounts.length) * 100) / 100
      : 0,
    median: Math.round(median(sentenceWordCounts) * 100) / 100,
    min: sentenceWordCounts.length > 0 ? Math.min(...sentenceWordCounts) : 0,
    max: sentenceWordCounts.length > 0 ? Math.max(...sentenceWordCounts) : 0,
    distribution: { short, medium, long },
  };

  // --- Dialogue ratio ---
  // Italian uses guillemets or smart quotes for dialogue
  const guillemetsMatches = text.match(/\u00AB[^\u00BB]*\u00BB/g) ?? [];
  const smartQuoteMatches = text.match(/\u201C[^\u201D]*\u201D/g) ?? [];
  const straightQuoteMatches = text.match(/"[^"]*"/g) ?? [];

  const dialogueChars =
    guillemetsMatches.reduce((sum, m) => sum + m.length, 0) +
    smartQuoteMatches.reduce((sum, m) => sum + m.length, 0) +
    straightQuoteMatches.reduce((sum, m) => sum + m.length, 0);

  const dialogueRatio =
    text.length > 0
      ? Math.round((dialogueChars / text.length) * 10000) / 100
      : 0;

  // --- Gulpease readability index ---
  // Formula: 89 + (300 * sentences - 10 * letters) / words
  const letterCount = countLetters(text);
  const wordCount = words.length;
  const sentenceCount = sentences.length;

  const gulpease =
    wordCount > 0
      ? Math.round(
          (89 + (300 * sentenceCount - 10 * letterCount) / wordCount) * 100
        ) / 100
      : 0;

  // --- Type-Token Ratio ---
  const uniqueWords = new Set(words);
  const typeTokenRatio =
    wordCount > 0
      ? Math.round((uniqueWords.size / wordCount) * 10000) / 100
      : 0;

  return {
    topWords,
    sentenceStats,
    dialogueRatio,
    gulpease,
    typeTokenRatio,
  };
}
