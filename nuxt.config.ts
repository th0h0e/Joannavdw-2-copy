import process from 'node:process'

export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
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
    'nuxt-ssr-api-logger',
    '@nuxt/image',
    '@nuxt/ui',
  ],

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
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
