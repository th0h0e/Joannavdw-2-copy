export default defineNuxtConfig({
  // Nuxt 4 compatibility date — controls behavioral defaults
  compatibilityDate: '2025-01-01',

  // Modules
  modules: [// Auto-imports all @vueuse/core composables
  '@vueuse/nuxt', '@nuxt/eslint', '@sentry/nuxt', '@nuxtjs/device', '@nuxt/a11y', '@nuxt/hints', 'nuxt-ssr-api-logger', '@nuxt/image', '@nuxt/ui'],

  devtools: {
    enabled: true,
  },

  // ESLint — standalone: false so antfu/eslint-config handles all rules
  eslint: {
    config: {
      standalone: false,
    },
  },

  // Global CSS (replaces import in main.ts)
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Runtime config — environment-driven values
  // Override via NUXT_PB_URL (server-only) and NUXT_PUBLIC_SENTRY_DSN env vars
  runtimeConfig: {
    pbUrl: 'https://admin.kontext.site',
    public: {
      pbUrl: 'https://admin.kontext.site',
      sentry: {
        dsn: 'https://4981600ff5cc02441de606ca9943a126@o4510808141398016.ingest.de.sentry.io/4510808149983312',
      },
    },
  },

  typescript: {
    strict: true,
  },
})