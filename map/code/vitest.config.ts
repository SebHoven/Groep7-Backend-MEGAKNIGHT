import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",      // Node environment (for backend)
    setupFiles: "./tests/setup.ts", // optional setup file
    include: ["tests/**/*.test.ts"],
  },
});