import process from 'node:process'

export default defineNuxtConfig({
  // Client-side only rendering
  ssr: false,

  // Nuxt 4 compatibility date — controls behavioral defaults
  compatibilityDate: '2025-01-01',

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/assets/favicon.ico' }],
    },
  },

  // Source maps for Sentry integration
  sourcemap: {
    client: 'hidden',
  },

  // Modules
  modules: [// Auto-imports all @vueuse/core composables
    '@vueuse/nuxt',
    '@vueuse/motion',
    '@nuxt/eslint',
    '@sentry/nuxt/module',
    '@nuxtjs/device',
    '@nuxt/a11y',
    '@nuxt/hints',
    'nuxt-ssr-api-logger',
    '@nuxt/image',
    '@nuxt/ui',
  ],

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  // Sentry configuration for source map uploads
  // sentry: {
  // org: 'kontext',
  // project: 'portfolio',
  // authToken: process.env.SENTRY_AUTH_TOKEN,
  //  },

  // ESLint — standalone: false so antfu/eslint-config handles all rules
  eslint: {
    config: {
      standalone: false,
    },
  },

  // CSS imports
  css: ['~/assets/main.css'],

  // Runtime config — environment-driven values
  // Set NUXT_PUBLIC_PB_URL and NUXT_PUBLIC_SENTRY_DSN in .env
  runtimeConfig: {
    public: {
      pbUrl: process.env.NUXT_PUBLIC_PB_URL || 'https://admin.kontext.site',
      sentry: {
        dsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
      },
    },
  },

  typescript: {
    strict: true,
  },
})
