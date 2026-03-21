/**
 * Rate limiter in-memory per le API route.
 * Utilizza una Map per tracciare le richieste per chiave (es. IP, userId).
 *
 * Nota: funziona solo per singola istanza server.
 * Per ambienti multi-istanza, utilizzare Redis (es. Upstash).
 */

interface RateLimitConfig {
  /** Finestra temporale in millisecondi */
  interval: number;
  /** Numero massimo di richieste nella finestra */
  limit: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  /** `true` se la richiesta e' consentita, `false` se il limite e' superato */
  success: boolean;
  /** Richieste rimanenti nella finestra corrente */
  remaining: number;
  /** Timestamp (ms) in cui il contatore si resetta */
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Pulizia periodica delle entry scadute ogni 60 secondi
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupInterval !== null) {
    return;
  }
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
      }
    }
    // Se la store e' vuota, ferma il timer per non sprecare risorse
    if (store.size === 0 && cleanupInterval !== null) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, 60_000);
}

/**
 * Controlla e aggiorna il rate limit per una chiave specifica.
 *
 * @param key - Identificativo univoco (es. `api:${ip}`, `auth:${userId}`)
 * @param config - Configurazione con intervallo e limite
 * @returns Oggetto con `success`, `remaining` e `resetAt`
 *
 * @example
 * ```ts
 * const result = rateLimit(`api:${ip}`, RATE_LIMITS.api);
 * if (!result.success) {
 *   return new Response("Troppe richieste", { status: 429 });
 * }
 * ```
 */
export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // Se non esiste o la finestra e' scaduta, crea una nuova entry
  if (!entry || now >= entry.resetAt) {
    const resetAt = now + config.interval;
    store.set(key, { count: 1, resetAt });
    ensureCleanup();
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt,
    };
  }

  // Se il limite e' stato raggiunto, nega la richiesta
  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Incrementa il contatore
  entry.count += 1;
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/** Preset di configurazione per diversi tipi di endpoint */
export const RATE_LIMITS = {
  /** Endpoint API generici: 60 richieste al minuto */
  api: { interval: 60_000, limit: 60 },
  /** Endpoint di autenticazione: 10 richieste al minuto */
  auth: { interval: 60_000, limit: 10 },
  /** Endpoint AI (generazione testo, suggerimenti): 15 richieste al minuto */
  ai: { interval: 60_000, limit: 15 },
  /** Iscrizione newsletter: 3 richieste all'ora */
  newsletter: { interval: 3_600_000, limit: 3 },
  /** Export documenti: 5 richieste al minuto */
  export: { interval: 60_000, limit: 5 },
  /** Invio feedback: 5 richieste all'ora */
  feedback: { interval: 3_600_000, limit: 5 },
} as const;
