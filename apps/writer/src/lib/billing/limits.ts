// ---------------------------------------------------------------------------
// Feature gating utilities — per-tier limits and capability checks
// ---------------------------------------------------------------------------

export const TIER_LIMITS = {
  FREE: {
    aiGenerationsPerDay: 15,
    maxProjects: 2,
    exportEnabled: false,
    coherenceTiers: [1] as number[],
  },
  WRITER: {
    aiGenerationsPerDay: 150,
    maxProjects: 10,
    exportEnabled: true,
    coherenceTiers: [1, 2] as number[],
  },
  PROFESSIONAL: {
    aiGenerationsPerDay: Infinity,
    maxProjects: Infinity,
    exportEnabled: true,
    coherenceTiers: [1, 2, 3] as number[],
  },
} as const;

export type Tier = keyof typeof TIER_LIMITS;

// ---------------------------------------------------------------------------
// Capability helpers
// ---------------------------------------------------------------------------

/** Whether the given tier can export manuscripts. */
export function canExport(tier: Tier): boolean {
  return TIER_LIMITS[tier].exportEnabled;
}

/** Whether the given tier has access to a specific coherence analysis tier. */
export function canUseCoherenceTier(tier: Tier, coherenceTier: number): boolean {
  return (TIER_LIMITS[tier].coherenceTiers as readonly number[]).includes(
    coherenceTier
  );
}

/** Maximum number of projects a tier is allowed to own. */
export function getProjectLimit(tier: Tier): number {
  return TIER_LIMITS[tier].maxProjects;
}

/** Maximum number of AI generations per day for a tier. */
export function getAiLimit(tier: Tier): number {
  return TIER_LIMITS[tier].aiGenerationsPerDay;
}
