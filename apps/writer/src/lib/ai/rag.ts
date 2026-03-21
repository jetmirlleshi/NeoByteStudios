// ---------------------------------------------------------------------------
// RAG (Retrieval-Augmented Generation) — Hybrid search pipeline
// ---------------------------------------------------------------------------

import { db, nbwAiMemoryChunks, eq, and, sql } from "@neobytestudios/db";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { queryVectors } from "@/lib/ai/pinecone";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RAGResult {
  id: string;
  content: string;
  type: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface RAGSearchParams {
  projectId: string;
  query: string;
  topK?: number;
  filters?: {
    types?: string[];
    excludeChapterIds?: string[];
    currentChapterNumber?: number;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Reciprocal Rank Fusion constant — higher = less weight for rank position */
const RRF_K = 60;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Hybrid search combining Pinecone vector search and PostgreSQL full-text
 * search, merged via Reciprocal Rank Fusion (RRF).
 *
 * Steps:
 * 1. Generate embedding for the query text
 * 2. Vector search in Pinecone (over-fetch at topK * 2)
 * 3. Full-text search in PostgreSQL on nbwAiMemoryChunks.content
 * 4. RRF merge of both result sets
 * 5. Temporal decay for CHAPTER_CONTENT type
 * 6. Return top `topK` results
 */
export async function searchRAG(params: RAGSearchParams): Promise<RAGResult[]> {
  const { projectId, query, topK = 10, filters } = params;

  if (!query.trim()) return [];

  // Step 1: Generate embedding
  const queryEmbedding = await generateEmbedding(query);

  // Step 2 + 3: Run vector search and full-text search in parallel
  const [vectorResults, ftsResults] = await Promise.all([
    runVectorSearch(projectId, queryEmbedding, topK * 2, filters),
    runFullTextSearch(projectId, query, topK * 2, filters),
  ]);

  // Step 4: Reciprocal Rank Fusion
  const merged = reciprocalRankFusion(vectorResults, ftsResults);

  // Step 5: Apply temporal decay for CHAPTER_CONTENT type
  if (filters?.currentChapterNumber !== undefined) {
    applyTemporalDecay(merged, filters.currentChapterNumber);
  }

  // Step 6: Sort by score descending and return top K
  merged.sort((a, b) => b.score - a.score);
  return merged.slice(0, topK);
}

// ---------------------------------------------------------------------------
// Vector search (Pinecone)
// ---------------------------------------------------------------------------

async function runVectorSearch(
  projectId: string,
  vector: number[],
  topK: number,
  filters?: RAGSearchParams["filters"]
): Promise<RAGResult[]> {
  // Build Pinecone filter
  const pineconeFilter: Record<string, unknown> = {};

  if (filters?.types && filters.types.length > 0) {
    pineconeFilter.type = { $in: filters.types };
  }

  if (filters?.excludeChapterIds && filters.excludeChapterIds.length > 0) {
    pineconeFilter.sourceId = { $nin: filters.excludeChapterIds };
  }

  const hasFilter = Object.keys(pineconeFilter).length > 0;

  try {
    const matches = await queryVectors({
      projectId,
      vector,
      topK,
      ...(hasFilter ? { filter: pineconeFilter } : {}),
    });

    // Resolve metadata from DB for each match
    const ids = matches.map((m) => m.id);
    if (ids.length === 0) return [];

    const chunks = await db
      .select()
      .from(nbwAiMemoryChunks)
      .where(
        and(
          eq(nbwAiMemoryChunks.projectId, projectId),
          sql`${nbwAiMemoryChunks.vectorId} = ANY(${ids})`
        )
      );

    // Build a lookup map: vectorId -> chunk
    const chunkByVectorId = new Map(
      chunks.map((c) => [c.vectorId, c])
    );

    const results: RAGResult[] = [];
    for (const match of matches) {
      const chunk = chunkByVectorId.get(match.id);
      if (!chunk) continue;
      results.push({
        id: chunk.id,
        content: chunk.content,
        type: chunk.type as string,
        score: match.score,
        metadata: (chunk.metadata ?? {}) as Record<string, unknown>,
      });
    }
    return results;
  } catch (error) {
    console.error("[RAG] Vector search failed:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Full-text search (PostgreSQL)
// ---------------------------------------------------------------------------

async function runFullTextSearch(
  projectId: string,
  query: string,
  limit: number,
  filters?: RAGSearchParams["filters"]
): Promise<RAGResult[]> {
  try {
    // Build WHERE conditions
    const conditions = [
      sql`${nbwAiMemoryChunks.projectId} = ${projectId}`,
      sql`to_tsvector('italian', ${nbwAiMemoryChunks.content}) @@ plainto_tsquery('italian', ${query})`,
    ];

    if (filters?.types && filters.types.length > 0) {
      conditions.push(
        sql`${nbwAiMemoryChunks.type} = ANY(${filters.types})`
      );
    }

    if (filters?.excludeChapterIds && filters.excludeChapterIds.length > 0) {
      conditions.push(
        sql`${nbwAiMemoryChunks.sourceId} != ALL(${filters.excludeChapterIds})`
      );
    }

    const rows = await db
      .select({
        id: nbwAiMemoryChunks.id,
        content: nbwAiMemoryChunks.content,
        type: nbwAiMemoryChunks.type,
        metadata: nbwAiMemoryChunks.metadata,
        rank: sql<number>`ts_rank(
          to_tsvector('italian', ${nbwAiMemoryChunks.content}),
          plainto_tsquery('italian', ${query})
        )`,
      })
      .from(nbwAiMemoryChunks)
      .where(sql.join(conditions, sql` AND `))
      .orderBy(
        sql`ts_rank(
          to_tsvector('italian', ${nbwAiMemoryChunks.content}),
          plainto_tsquery('italian', ${query})
        ) DESC`
      )
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      type: row.type,
      score: row.rank,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
    }));
  } catch (error) {
    console.error("[RAG] Full-text search failed:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Reciprocal Rank Fusion (RRF)
// ---------------------------------------------------------------------------

/**
 * Merge two ranked lists using Reciprocal Rank Fusion.
 *
 * RRF score for a document d across lists:
 *   score(d) = SUM( 1 / (K + rank_i(d)) )  for each list i
 *
 * where K is a constant (60 by default) and rank starts at 1.
 */
function reciprocalRankFusion(
  vectorResults: RAGResult[],
  ftsResults: RAGResult[]
): RAGResult[] {
  const scoreMap = new Map<string, { result: RAGResult; score: number }>();

  // Score from vector search
  vectorResults.forEach((result, index) => {
    const rrfScore = 1 / (RRF_K + index + 1);
    const existing = scoreMap.get(result.id);

    if (existing) {
      existing.score += rrfScore;
    } else {
      scoreMap.set(result.id, { result, score: rrfScore });
    }
  });

  // Score from full-text search
  ftsResults.forEach((result, index) => {
    const rrfScore = 1 / (RRF_K + index + 1);
    const existing = scoreMap.get(result.id);

    if (existing) {
      existing.score += rrfScore;
    } else {
      scoreMap.set(result.id, { result, score: rrfScore });
    }
  });

  // Convert map to array and assign the fused score
  return Array.from(scoreMap.values()).map(({ result, score }) => ({
    ...result,
    score,
  }));
}

// ---------------------------------------------------------------------------
// Temporal decay
// ---------------------------------------------------------------------------

/**
 * Apply temporal decay to CHAPTER_CONTENT results.
 *
 * Chapters closer to the current chapter get higher scores.
 * Formula: score *= 0.3 + 0.7 * exp(-|chapterDistance| / 5)
 *
 * Mutates the array in place.
 */
function applyTemporalDecay(
  results: RAGResult[],
  currentChapterNumber: number
): void {
  for (const result of results) {
    if (result.type !== "CHAPTER_CONTENT") continue;

    const chapterNumber =
      typeof result.metadata.chapterNumber === "number"
        ? result.metadata.chapterNumber
        : null;

    if (chapterNumber === null) continue;

    const distance = Math.abs(currentChapterNumber - chapterNumber);
    const decay = 0.3 + 0.7 * Math.exp(-distance / 5);
    result.score *= decay;
  }
}
