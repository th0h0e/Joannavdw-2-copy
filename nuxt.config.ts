export default defineNuxtConfig({
  // Nuxt 4 compatibility date — controls behavioral defaults
  compatibilityDate: "2025-01-01",

  // Global CSS (replaces import in main.ts)
  css: ["~/assets/css/main.css"],

  // Modules
  modules: [
    "@vueuse/nuxt", // Auto-imports all @vueuse/core composables
    "@nuxt/eslint",
  ],

  // Dev server (replaces vite.config.ts server settings)
  devServer: {
    port: 5174,
  },

  // PostCSS (Tailwind)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Runtime config — environment-driven values
  // Override via NUXT_PUBLIC_PB_URL and NUXT_PUBLIC_SENTRY_DSN env vars
  runtimeConfig: {
    public: {
      pbUrl: "https://admin.kontext.site",
      sentryDsn:
        "https://4981600ff5cc02441de606ca9943a126@o4510808141398016.ingest.de.sentry.io/4510808149983312",
    },
  },

  // TypeScript
  typescript: {
    strict: true,
  },
});