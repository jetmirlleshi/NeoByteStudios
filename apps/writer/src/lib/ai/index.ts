// ---------------------------------------------------------------------------
// AI Core Library — barrel exports
// ---------------------------------------------------------------------------

// LLM (Anthropic Claude)
export {
  getAnthropicClient,
  generateWithClaude,
  streamWithClaude,
  MODEL_SONNET,
  MODEL_HAIKU,
} from "./llm";

export type {
  ClaudeModel,
  GenerateParams,
  StreamParams,
} from "./llm";

// Embeddings (OpenAI)
export {
  getOpenAIClient,
  generateEmbedding,
  generateEmbeddings,
} from "./embeddings";

// Vector store (Pinecone)
export {
  getPineconeClient,
  getIndex,
  upsertVectors,
  queryVectors,
  deleteVectors,
} from "./pinecone";

export type {
  UpsertVectorsParams,
  QueryVectorsParams,
  DeleteVectorsParams,
  QueryResult,
} from "./pinecone";

// Text chunking
export { chunkText } from "./chunking";

export type {
  ChunkResult,
  ChunkOptions,
} from "./chunking";

// Entity chunking
export {
  chunkCharacter,
  chunkLocation,
  chunkWorldRule,
  chunkItem,
  chunkFaction,
} from "./entity-chunker";

export type { EntityChunk } from "./entity-chunker";

// Rate limiting
export {
  AI_LIMITS,
  checkAiRateLimit,
  rateLimitHeaders,
} from "./rate-limit";

export type { RateLimitResult } from "./rate-limit";

// Prompts
export {
  getSystemPrompt,
  getUserPrompt,
} from "./prompts";

export type {
  GenerationType,
  SystemPromptContext,
} from "./prompts";

// RAG (Retrieval-Augmented Generation)
export { searchRAG } from "./rag";

export type {
  RAGResult,
  RAGSearchParams,
} from "./rag";

// Context builder
export { buildGenerationContext } from "./context-builder";

export type {
  GenerationContext,
  BuildContextParams,
} from "./context-builder";

// Narrative facts extraction
export { extractNarrativeFacts, persistFacts } from "./facts";

export type { ExtractedFact } from "./facts";

// Chapter summaries
export { generateChapterSummary, stripHtml } from "./summaries";

// AI writing suggestions
export { generateSuggestions } from "./suggestions";

export type { Suggestion, SuggestionTrigger } from "./suggestions";
