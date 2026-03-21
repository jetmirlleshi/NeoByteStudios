import { describe, it, expect, vi, beforeEach } from "vitest";
import { rateLimit } from "@/lib/security/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultConfig = { interval: 60_000, limit: 5 };

  describe("within window", () => {
    it("should allow requests within the limit", () => {
      const result = rateLimit("test-key-1", defaultConfig);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("should decrement remaining with each call", () => {
      const key = "test-key-2";

      const r1 = rateLimit(key, defaultConfig);
      expect(r1.success).toBe(true);
      expect(r1.remaining).toBe(4);

      const r2 = rateLimit(key, defaultConfig);
      expect(r2.success).toBe(true);
      expect(r2.remaining).toBe(3);

      const r3 = rateLimit(key, defaultConfig);
      expect(r3.success).toBe(true);
      expect(r3.remaining).toBe(2);
    });

    it("should allow exactly the limit number of requests", () => {
      const key = "test-key-3";

      for (let i = 0; i < defaultConfig.limit; i++) {
        const result = rateLimit(key, defaultConfig);
        expect(result.success).toBe(true);
      }
    });

    it("should return a valid resetAt timestamp", () => {
      const now = Date.now();
      const result = rateLimit("test-key-4", defaultConfig);
      expect(result.resetAt).toBeGreaterThanOrEqual(now);
      expect(result.resetAt).toBeLessThanOrEqual(now + defaultConfig.interval);
    });
  });

  describe("exceeded", () => {
    it("should reject requests exceeding the limit", () => {
      const key = "test-key-5";

      // Exhaust the limit
      for (let i = 0; i < defaultConfig.limit; i++) {
        rateLimit(key, defaultConfig);
      }

      // This one should fail
      const result = rateLimit(key, defaultConfig);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should continue to reject after being exceeded", () => {
      const key = "test-key-6";

      // Exhaust the limit
      for (let i = 0; i < defaultConfig.limit; i++) {
        rateLimit(key, defaultConfig);
      }

      // Multiple extra requests should all fail
      for (let i = 0; i < 3; i++) {
        const result = rateLimit(key, defaultConfig);
        expect(result.success).toBe(false);
        expect(result.remaining).toBe(0);
      }
    });
  });

  describe("reset after interval", () => {
    it("should reset the counter after the interval elapses", () => {
      const key = "test-key-7";

      // Exhaust the limit
      for (let i = 0; i < defaultConfig.limit; i++) {
        rateLimit(key, defaultConfig);
      }

      // Should be blocked
      expect(rateLimit(key, defaultConfig).success).toBe(false);

      // Advance time past the interval
      vi.advanceTimersByTime(defaultConfig.interval + 1);

      // Should be allowed again
      const result = rateLimit(key, defaultConfig);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("should reset to full limit after interval", () => {
      const key = "test-key-8";

      // Use 3 of 5 requests
      for (let i = 0; i < 3; i++) {
        rateLimit(key, defaultConfig);
      }

      // Advance time past the interval
      vi.advanceTimersByTime(defaultConfig.interval + 1);

      // Should have full limit again
      const result = rateLimit(key, defaultConfig);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });
  });

  describe("independent keys", () => {
    it("should track different keys independently", () => {
      const keyA = "user-alpha";
      const keyB = "user-beta";

      // Exhaust limit for key A
      for (let i = 0; i < defaultConfig.limit; i++) {
        rateLimit(keyA, defaultConfig);
      }

      // Key A should be blocked
      expect(rateLimit(keyA, defaultConfig).success).toBe(false);

      // Key B should still be allowed
      const resultB = rateLimit(keyB, defaultConfig);
      expect(resultB.success).toBe(true);
      expect(resultB.remaining).toBe(4);
    });

    it("should allow different configs per key", () => {
      const keyC = "api-standard";
      const keyD = "api-premium";

      const standardConfig = { interval: 60_000, limit: 3 };
      const premiumConfig = { interval: 60_000, limit: 10 };

      // Exhaust standard limit
      for (let i = 0; i < standardConfig.limit; i++) {
        rateLimit(keyC, standardConfig);
      }

      // Standard key blocked
      expect(rateLimit(keyC, standardConfig).success).toBe(false);

      // Premium key still has plenty of room
      const result = rateLimit(keyD, premiumConfig);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(9);
    });
  });
});
