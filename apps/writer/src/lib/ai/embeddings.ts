import OpenAI from "openai";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMBEDDING_MODEL = "text-embedding-3-large" as const;
const EMBEDDING_DIMENSIONS = 1536;

/** OpenAI allows up to 2048 inputs per single embeddings request. */
const MAX_BATCH_SIZE = 2048;

// ---------------------------------------------------------------------------
// Singleton client
// ---------------------------------------------------------------------------

let _client: OpenAI | null = null;

/**
 * Returns a lazily-initialised OpenAI client singleton.
 * Throws a descriptive error if the API key is missing.
 */
export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "[AI] Missing OPENAI_API_KEY environment variable. " +
          "Set it in your .env file to generate embeddings."
      );
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a single embedding vector for the given text.
 * Uses `text-embedding-3-large` with 1536 dimensions.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });

  return response.data[0]!.embedding;
}

/**
 * Generate embedding vectors for a batch of texts.
 * Automatically splits into chunks of 2048 if the input exceeds
 * the OpenAI per-request limit.
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const client = getOpenAIClient();
  const allEmbeddings: number[][] = [];

  // Process in batches of MAX_BATCH_SIZE
  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE);

    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    // The API returns embeddings in the same order as the input,
    // but we sort by index to be safe.
    const sorted = response.data
      .slice()
      .sort((a, b) => a.index - b.index);

    for (const item of sorted) {
      allEmbeddings.push(item.embedding);
    }
  }

  return allEmbeddings;
}
