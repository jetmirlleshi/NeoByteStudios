// ---------------------------------------------------------------------------
// Coherence checking system - barrel exports
// ---------------------------------------------------------------------------

// Tier 1: Client-side regex checks (FREE tier)
// NOTE: tier1-local.ts uses "use client" and should be imported directly
// in client components. Re-exported here for type convenience.
export { runTier1Checks } from "./tier1-local";
export type { Tier1Alert, CharacterInfo } from "./tier1-local";

// Tier 2: Claude Haiku lightweight check (WRITER+ tier)
export { runTier2Check } from "./tier2-haiku";
export type { Tier2Alert, Tier2Params } from "./tier2-haiku";

// Tier 3: Claude Sonnet deep analysis (PROFESSIONAL tier)
export { runTier3Analysis } from "./tier3-sonnet";
export type { Tier3Alert, Tier3Params } from "./tier3-sonnet";
