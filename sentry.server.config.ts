import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as Sentry from '@sentry/nuxt'
import dotenv from 'dotenv'

// Load environment variables from .env file in project root
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env'),
  debug: true })

// Only run `init` when SENTRY_DSN is available
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  })
}
