import process from 'node:process'

export default defineNuxtConfig({
  routeRules: {
    '/': { ssr: false },
    '/admin/**': { ssr: false },
    '/dashboard': { ssr: false },
  },

  compatibilityDate: '2025-01-01',

  nitro: {
    preset: 'bun',
  },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/assets/favicon.ico' }],
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@vueuse/motion',
    '@nuxt/eslint',
    '@nuxtjs/device',
    '@nuxt/a11y',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
  ],

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',

    timeline: {
      enabled: true,
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  css: ['~/assets/main.css'],

  runtimeConfig: {
    public: {
      pbUrl: process.env.NUXT_PUBLIC_PB_URL || 'https://admin.kontext.site',
    },
  },

  typescript: {
    strict: true,
  },
})
