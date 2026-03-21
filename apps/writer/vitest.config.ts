import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["node_modules", ".next", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/hooks/**", "src/stores/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@neobytestudios/db": resolve(__dirname, "../../packages/db/src"),
      "@neobytestudios/auth": resolve(__dirname, "../../packages/auth/src"),
    },
  },
});
