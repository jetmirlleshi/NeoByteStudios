import { Pinecone } from "@pinecone-database/pinecone";
import type { Index, RecordMetadata } from "@pinecone-database/pinecone";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UpsertVectorsParams {
  projectId: string;
  vectors: {
    id: string;
    values: number[];
    metadata: Record<string, string | number>;
  }[];
}

export interface QueryVectorsParams {
  projectId: string;
  vector: number[];
  topK: number;
  filter?: Record<string, unknown>;
}

export interface DeleteVectorsParams {
  projectId: string;
  ids: string[];
}

export interface QueryResult {
  id: string;
  score: number;
  metadata: Record<string, string | number> | undefined;
}

// ---------------------------------------------------------------------------
// Singleton client
// ---------------------------------------------------------------------------

let _client: Pinecone | null = null;

/**
 * Returns a lazily-initialised Pinecone client singleton.
 * Throws a descriptive error if the API key is missing.
 */
export function getPineconeClient(): Pinecone {
  if (!_client) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "[AI] Missing PINECONE_API_KEY environment variable. " +
          "Set it in your .env file to use Pinecone vector search."
      );
    }
    _client = new Pinecone({ apiKey });
  }
  return _client;
}

/**
 * Returns the Pinecone index object identified by the PINECONE_INDEX env var.
 * Throws a descriptive error if the env var is missing.
 */
export function getIndex(): Index<RecordMetadata> {
  const indexName = process.env.PINECONE_INDEX;
  if (!indexName) {
    throw new Error(
      "[AI] Missing PINECONE_INDEX environment variable. " +
        "Set it in your .env file to use Pinecone vector search."
    );
  }
  return getPineconeClient().index({ name: indexName });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Upsert vectors into the Pinecone index.
 * Each project gets its own namespace (namespace = projectId).
 */
export async function upsertVectors(params: UpsertVectorsParams): Promise<void> {
  const { projectId, vectors } = params;
  if (vectors.length === 0) return;

  const index = getIndex();
  const ns = index.namespace(projectId);

  await ns.upsert({
    records: vectors.map((v) => ({
      id: v.id,
      values: v.values,
      metadata: v.metadata,
    })),
  });
}

/**
 * Query the Pinecone index for the nearest neighbours of a vector.
 * Searches within the project's namespace.
 */
export async function queryVectors(
  params: QueryVectorsParams
): Promise<QueryResult[]> {
  const { projectId, vector, topK, filter } = params;

  const index = getIndex();
  const ns = index.namespace(projectId);

  const result = await ns.query({
    vector,
    topK,
    includeMetadata: true,
    ...(filter ? { filter } : {}),
  });

  return (result.matches ?? []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    metadata: match.metadata as Record<string, string | number> | undefined,
  }));
}

/**
 * Delete vectors from the Pinecone index by their IDs.
 */
export async function deleteVectors(params: DeleteVectorsParams): Promise<void> {
  const { projectId, ids } = params;
  if (ids.length === 0) return;

  const index = getIndex();
  const ns = index.namespace(projectId);

  await ns.deleteMany({ ids });
}
