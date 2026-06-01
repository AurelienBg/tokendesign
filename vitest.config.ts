import { defineConfig } from 'vitest/config'

// The engine is pure TypeScript with no Nuxt/Vue imports, so unit tests run
// in a plain Node environment without spinning up Nuxt.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['utils/**/*.test.ts']
  }
})
