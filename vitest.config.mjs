import { defineConfig } from 'vitest/config'
import { jsonSchemaCoveragePlugin } from "@hyperjump/json-schema-coverage/vitest"

export default defineConfig({
  plugins: [jsonSchemaCoveragePlugin()],
  test: {
    coverage: {
      include: ["schemas/**/*.yaml"],
      thresholds: process.env.BASE !== "dev" ? {
        statements: 100,    // JSON Schema keywords
        lines: 100,
        // functions: 100,  // subschemas, for example with `properties` - to be discussed
        // branches: 56.77, // branch coverage isn't that useful
      } : {}
    },
    forceRerunTriggers: ['**/scripts/**', '**/tests/**'],
    testTimeout: 10000, // 10 seconds
  },
})
