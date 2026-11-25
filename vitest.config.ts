import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    // `server-only` throws outside a React Server build; stub it for unit tests.
    alias: { "server-only": fileURLToPath(new URL("./tests/unit/stubs/server-only.ts", import.meta.url)) },
  },
});
