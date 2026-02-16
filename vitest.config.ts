import { defineVitestConfig } from '@nuxt/test-utils/config'
import { config } from 'dotenv'

config({ path: '.env.test' })

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    include: ['docs/tests/**/*.test.ts'],
    exclude: ['node_modules', '.nuxt', 'dist'],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})
