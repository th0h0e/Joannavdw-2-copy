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

  // App head (replaces index.html <head>)
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
      title: "Joanna van der Werf - Creative Strategy",
      meta: [
        { name: "format-detection", content: "telephone=no" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "theme-color", content: "#000000" },
      ],
      link: [{ rel: "manifest", href: "/manifest.json" }],
      // Browser detection script (from index.html)
      script: [
        {
          innerHTML: `(function() {
            var ua = navigator.userAgent.toLowerCase();
            var isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium');
            var isWebKit = 'webkitAppearance' in document.documentElement.style;
            var hasSafariFeatures = window.safari !== undefined;
            var isSafariBrowser = isSafari || (isWebKit && hasSafariFeatures);
            var supportsScrollState = CSS && CSS.supports && CSS.supports('container-type', 'scroll-state');
            var root = document.documentElement;
            root.style.setProperty('--is-safari', isSafariBrowser ? '1' : '0');
            root.style.setProperty('--supports-scroll-state', supportsScrollState ? '1' : '0');
            root.style.setProperty('--use-css-scroll-detection', !isSafariBrowser && supportsScrollState ? '1' : '0');
            root.setAttribute('data-browser-safari', isSafariBrowser.toString());
            root.setAttribute('data-supports-scroll-state', supportsScrollState.toString());
          })();`,
          type: "text/javascript",
          tagPosition: "head",
        },
      ],
    },
  },

  // Use short component names (no path prefix for subdirectories)
  components: [{ path: "~/components", pathPrefix: false }],

  // TypeScript
  typescript: {
    strict: true,
  },
});