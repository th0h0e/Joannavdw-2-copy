import dotenv from 'dotenv'
import * as Sentry from '@sentry/nuxt'

// Load environment variables from .env file
dotenv.config()

// Only run `init` when SENTRY_DSN is available
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  })
}
