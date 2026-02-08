# Nuxt Migration Plan — Vue to Nuxt 4

## Branch Strategy

**All Nuxt migration work happens exclusively on the `claude/react-to-vue-migration-EOVOp` branch.** Do not modify `master` or the Vue branch. This ensures both the React and Vue versions of the app remain intact and functional on their respective branches. The Nuxt migration is isolated to this feature branch until it is fully verified and ready to merge.

## Overview

This plan converts the existing Vue 3 + Vite + Vue Router app (`vue/`) into a Nuxt 4 application. The app is a portfolio site with PocketBase backend, CSS scroll-snap navigation, and an admin dashboard.

Nuxt 4 uses an `app/` directory as its application root. The current `vue/` folder structure was designed to mirror Nuxt conventions, so the migration is primarily about:
1. Replacing manual wiring (main.ts, router, vite config) with Nuxt conventions
2. Moving files from `vue/` into `app/`
3. Leveraging Nuxt auto-imports, file-based routing, plugins, and middleware

---

## Current Structure → Nuxt 4 Structure

```
CURRENT (vue/)                          NUXT 4 (app/)
─────────────────────                   ─────────────────────
vue/main.ts                         →   REMOVED (Nuxt handles app creation)
vue/app.vue                         →   app/app.vue (modified)
vue/env.d.ts                        →   REMOVED (Nuxt generates types)
vue/router/index.ts                 →   REMOVED (file-based routing)
vue/plugins/pocketbase.ts           →   app/plugins/pocketbase.client.ts
vue/composables/*.ts                →   app/composables/*.ts (auto-imported)
vue/components/**/*.vue             →   app/components/**/*.vue (auto-imported)
vue/pages/Home.vue                  →   app/pages/index.vue
vue/pages/admin/AdminLogin.vue      →   app/pages/admin/index.vue
vue/pages/admin/AdminDashboard.vue  →   app/pages/admin/dashboard.vue
vue/shared/types/                   →   app/shared/types/ (or shared/)
vue/utils/sharedStyles.ts           →   app/utils/sharedStyles.ts (auto-imported)
vue/assets/                         →   app/assets/
vue/layouts/                        →   app/layouts/
vue/middleware/                      →   app/middleware/
index.html                          →   REMOVED (Nuxt generates HTML)
vite.config.ts                      →   REMOVED (replaced by nuxt.config.ts)
tsconfig.vue.json                   →   REMOVED (Nuxt generates tsconfig)
tsconfig.node.json                  →   REMOVED
tsconfig.json                       →   REMOVED (Nuxt generates .nuxt/tsconfig.json)

NEW FILES
─────────────────────
nuxt.config.ts                      ←   NEW (central configuration)
app/middleware/auth.ts              ←   NEW (replaces beforeEnter route guard)
app/plugins/sentry.client.ts       ←   NEW (replaces Sentry init in main.ts)
```

---

## Phase 1 — Install Nuxt & Configure

### Prerequisites

- **Node.js 20.x or newer** (even-numbered versions recommended)

### 1.1 — Update dependencies

Since this is an existing project (not a fresh scaffold), we install Nuxt directly as a dependency — **not** via `npm create nuxt@latest` (which is for new projects only).

**Install Nuxt:**
```bash
npm install nuxt
```

**Remove** (Nuxt provides these internally — vue, vue-router, and vite are bundled with Nuxt):
```bash
npm uninstall vue vue-router @vitejs/plugin-vue vite vue-tsc
```

**Keep** (these work with Nuxt as-is):
```
@sentry/vue
@vueuse/core
@vueuse/integrations
@vueuse/motion
pocketbase
sortablejs
```

**Add Nuxt-compatible dev deps:**
```bash
npm install -D @nuxt/eslint
```

**Remove unnecessary dev deps:**
```bash
npm uninstall @vitejs/plugin-vue vue-tsc
```

### 1.2 — Create `nuxt.config.ts`

This replaces `vite.config.ts`, `tsconfig.vue.json`, `index.html` head config, and CSS imports.

```typescript
export default defineNuxtConfig({
  // Nuxt 4 compatibility date — controls behavioral defaults
  compatibilityDate: '2025-01-01',

  // Global CSS (replaces import in main.ts)
  css: ['~/assets/css/main.css'],

  // Modules
  modules: [
    '@vueuse/nuxt',    // Auto-imports all @vueuse/core composables
    '@nuxt/eslint',
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
      pbUrl: 'https://admin.kontext.site',
      sentryDsn: 'https://4981600ff5cc02441de606ca9943a126@o4510808141398016.ingest.de.sentry.io/4510808149983312',
    },
  },

  // App head (replaces index.html <head>)
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
      title: 'Joanna van der Werf - Creative Strategy',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#000000' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
      ],
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
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },

  // SSR off — this is a client-rendered SPA
  // PocketBase client uses localStorage, subscriptions, and DOM APIs
  ssr: false,

  // TypeScript
  typescript: {
    strict: true,
  },
})
```

**Key config decisions:**

- **`ssr: false`:** The app relies heavily on client-only APIs — localStorage caching, PocketBase real-time subscriptions (SSE), IntersectionObserver, scroll-snap DOM manipulation, `window.innerWidth`, etc. Running as an SPA avoids hydration mismatches and keeps behavior identical to the current Vue app. SSR can be explored later as a separate optimization.
- **`runtimeConfig.public`:** Moves the hardcoded PocketBase URL and Sentry DSN into Nuxt's runtime config system. These can be overridden via environment variables (`NUXT_PUBLIC_PB_URL`, `NUXT_PUBLIC_SENTRY_DSN`) without rebuilding. Access them in code via `useRuntimeConfig().public.pbUrl`.
- **`compatibilityDate`:** Nuxt 4 uses a date-based versioning system instead of `compatibilityVersion`. This locks behavioral defaults to a specific date so future Nuxt updates don't silently change behavior.

### 1.2.1 — CSS root element selector

Nuxt uses `__nuxt` as its root element ID (not `#app`). Update `app/assets/css/main.css`:

```css
/* BEFORE */
#app {
  height: 100vh;
  width: 100%;
  background-color: #0a0a0a;
}

/* AFTER */
#__nuxt {
  height: 100vh;
  width: 100%;
  background-color: #0a0a0a;
}
```

Alternatively, keep `#app` and set `app.rootId: 'app'` in `nuxt.config.ts` to match the existing CSS.

### 1.3 — Update `package.json` scripts

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "convert-images": "node scripts/convert-images.cjs"
  }
}
```

### 1.4 — Delete replaced files

After creating `nuxt.config.ts`, delete:
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.vue.json`
- `tsconfig.node.json`
- `vue/main.ts`
- `vue/env.d.ts`
- `vue/router/index.ts` (entire `vue/router/` directory)

### 1.5 — Update Tailwind config

```javascript
// tailwind.config.js
export default {
  content: [
    './app/**/*.{vue,ts}',   // Changed from ./vue/**
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 1.6 — Install `@vueuse/nuxt`

```bash
npm install @vueuse/nuxt
```

This module auto-imports all `@vueuse/core` composables. No more manual `import { useEventListener } from '@vueuse/core'` — they become globally available, just like `ref()`, `computed()`, etc.

---

## Phase 2 — Move `vue/` to `app/`

Rename the `vue/` directory to `app/`:

```bash
mv vue app
```

**Why this works:** Nuxt 4 expects application code inside `app/`. The internal folder structure (`components/`, `pages/`, `composables/`, `plugins/`, `assets/`, `layouts/`, `middleware/`, `utils/`) already matches Nuxt conventions exactly.

After renaming, verify the structure:
```
app/
├── app.vue
├── assets/
├── components/
├── composables/
├── layouts/
├── middleware/
├── pages/
├── plugins/
├── shared/types/
└── utils/
```

---

## Phase 3 — File-Based Routing (Replace Vue Router)

Nuxt generates routes automatically from the `app/pages/` directory. The file names determine the route paths.

### 3.1 — Rename page files

| Current path | New path | Generated route |
|---|---|---|
| `pages/Home.vue` | `pages/index.vue` | `/` |
| `pages/admin/AdminLogin.vue` | `pages/admin/index.vue` | `/admin` |
| `pages/admin/AdminDashboard.vue` | `pages/admin/dashboard.vue` | `/admin/dashboard` |

```bash
mv app/pages/Home.vue app/pages/index.vue
mv app/pages/admin/AdminLogin.vue app/pages/admin/index.vue
mv app/pages/admin/AdminDashboard.vue app/pages/admin/dashboard.vue
```

### 3.2 — Delete `router/` directory

```bash
rm -rf app/router/
```

The route guard from `router/index.ts` moves to middleware (Phase 5).

### 3.3 — Update `app.vue`

Replace `<router-view />` with Nuxt's `<NuxtPage />`:

```vue
<template>
  <NuxtPage />
</template>
```

`<NuxtPage>` is Nuxt's replacement for `<router-view>`. It's auto-imported — no import statement needed.

### 3.4 — Replace `useRouter` / `router.push` calls

In Nuxt, use `navigateTo()` (auto-imported) or `useRouter()` (also auto-imported, no import from `vue-router` needed).

**`pages/admin/index.vue` (AdminLogin):**
```typescript
// BEFORE
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/admin/dashboard')

// AFTER (option A — navigateTo)
await navigateTo('/admin/dashboard')

// AFTER (option B — useRouter, still works)
const router = useRouter()
router.push('/admin/dashboard')
// No import needed — useRouter is auto-imported by Nuxt
```

**`pages/admin/dashboard.vue` (AdminDashboard) — same pattern for logout redirect:**
```typescript
// BEFORE
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/admin')

// AFTER
await navigateTo('/admin')
```

---

## Phase 4 — Plugins

### 4.1 — PocketBase plugin (`app/plugins/pocketbase.client.ts`)

Rename `pocketbase.ts` → `pocketbase.client.ts`. The `.client` suffix tells Nuxt this plugin only runs on the client (it uses `localStorage`).

The file content stays almost the same. The only change: wrap it in `defineNuxtPlugin` and provide the PocketBase instance via Nuxt's plugin system.

```typescript
// app/plugins/pocketbase.client.ts
import PocketBase from 'pocketbase'

// Keep all existing type exports and helper functions as-is:
// - PortfolioProject, Homepage, About, Settings types
// - CACHE_DURATION, getCacheVersion, incrementCacheVersion
// - getCachedData, setCachedData, clearCache
// - getImageUrl, getProjectTitleStyle, getResponsiveFontSizes

// Use runtimeConfig for the PocketBase URL (configured in nuxt.config.ts,
// overridable via NUXT_PUBLIC_PB_URL env var)
const config = useRuntimeConfig()
const pb = new PocketBase(config.public.pbUrl as string)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      pb,
    },
  }
})

// Continue to export pb as default AND named helpers for direct imports
export { pb }
export { getCachedData, setCachedData, clearCache, getImageUrl, getProjectTitleStyle, getResponsiveFontSizes }
```

> **Alternative approach:** Keep `pb` as a plain exported module (no `defineNuxtPlugin` wrapper) and import it directly where needed. This is simpler and works fine for `ssr: false` apps. The plugin wrapper is only necessary if you need the instance available via `useNuxtApp().$pb` or if you later enable SSR and need per-request isolation. For now, the simpler direct-export approach is fine — just rename the file to `.client.ts` and keep the code as-is. If you skip the `defineNuxtPlugin` wrapper, call `useRuntimeConfig()` inside a composable or component instead (the context rule from Phase 6 applies).

### 4.2 — Sentry plugin (`app/plugins/sentry.client.ts`)

Extract Sentry init from the deleted `main.ts` into a Nuxt client plugin:

```typescript
// app/plugins/sentry.client.ts
import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: config.public.sentryDsn as string,
    sendDefaultPii: true,
  })
})
```

Both the PocketBase URL and Sentry DSN now come from `runtimeConfig` (defined in `nuxt.config.ts`). Override them per-environment via `NUXT_PUBLIC_PB_URL` and `NUXT_PUBLIC_SENTRY_DSN` environment variables — no rebuild needed.

---

## Phase 5 — Route Middleware (Auth Guard)

Replace the `beforeEnter` guard from `router/index.ts` with Nuxt route middleware.

### 5.1 — Create `app/middleware/auth.ts`

```typescript
// app/middleware/auth.ts
import { pb } from '~/plugins/pocketbase.client'

export default defineNuxtRouteMiddleware(() => {
  if (!pb.authStore.isValid) {
    return navigateTo('/admin')
  }
})
```

### 5.2 — Apply middleware to the dashboard page

In `app/pages/admin/dashboard.vue`, add `definePageMeta`:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

// ... rest of existing script
</script>
```

`definePageMeta` is a compiler macro — no import needed.

---

## Phase 6 — Auto-Imports (Remove Manual Imports)

Nuxt auto-imports from five sources. Only what you actually use ends up in your production bundle — tree-shaking is built in.

| Source | What's auto-imported | How it works |
|---|---|---|
| **Vue core** | `ref`, `computed`, `watch`, `onMounted`, `onUnmounted`, `nextTick`, `reactive`, `type Ref`, etc. | Built into Nuxt — always available |
| **Nuxt runtime** | `navigateTo`, `useRouter`, `useRoute`, `useHead`, `useFetch`, `useNuxtApp`, `definePageMeta`, `defineNuxtPlugin`, `defineNuxtRouteMiddleware`, etc. | Built into Nuxt — always available |
| **`app/composables/`** | All named exports from files in this directory | Scanned at build time |
| **`app/utils/`** | All named exports from files in this directory | Scanned at build time |
| **`app/components/`** | All `.vue` files, usable directly in templates | Scanned at build time, path-based naming for subdirs |

**Context rule:** Auto-imported composables (both Vue and Nuxt) must be called inside `<script setup>`, `setup()`, `defineNuxtPlugin`, or `defineNuxtRouteMiddleware`. Calling them outside these contexts causes "Nuxt instance is unavailable" errors.

**Explicit imports fallback:** If you ever need to be explicit (e.g. for clarity or to resolve naming conflicts), you can import from the `#imports` alias:
```typescript
import { ref, computed } from '#imports'
```

### 6.1 — Vue core APIs (auto-imported everywhere)

Remove these imports from **all** `.vue` files:
```typescript
// DELETE these lines wherever they appear:
import { ref, computed, watch, onMounted, onUnmounted, nextTick, reactive } from 'vue'
import type { Ref } from 'vue'
```

Vue types like `Ref` are also auto-imported. If you ever need to be explicit, use `import type { Ref } from '#imports'`.

### 6.2 — Composables (auto-imported from `app/composables/`)

Nuxt scans `app/composables/` and auto-imports all named exports. Only top-level files and `index.ts` files in immediate subdirectories are scanned by default.

Remove these imports:
```typescript
// DELETE:
import { usePocketBase } from '@/composables/usePocketBase'
import { useFaviconCache } from '@/composables/useFaviconCache'
import { useToast } from '@/composables/useToast'
```

Just call `usePocketBase()`, `useFaviconCache()`, `useToast()` directly — they're globally available.

The `ConvertedProject` interface exported from `usePocketBase.ts` and the `Toast` interface exported from `useToast.ts` are also auto-imported as types.

### 6.3 — VueUse composables (auto-imported via `@vueuse/nuxt` module)

The `@vueuse/nuxt` module (installed in Phase 1.6) registers auto-imports for all `@vueuse/core` and `@vueuse/integrations` composables.

Remove these imports:
```typescript
// DELETE:
import { useEventListener, useBreakpoints, useIntersectionObserver, useScroll } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations'
```

### 6.4 — Utils (auto-imported from `app/utils/`)

All named exports from files in `app/utils/` become globally available. Only top-level files are scanned by default.

Remove:
```typescript
// DELETE:
import { someStyle } from '@/utils/sharedStyles'
```

### 6.5 — Components (auto-imported from `app/components/`)

Remove **all** component imports from `<script setup>`:
```typescript
// DELETE all of these:
import Hero from '@/components/Hero.vue'
import HeroMobile from '@/components/HeroMobile.vue'
import MotionCarousel from '@/components/MotionCarousel.vue'
import MotionCarouselDesktop from '@/components/MotionCarouselDesktop.vue'
import ProjectPopup from '@/components/ProjectPopup.vue'
import AboutPopup from '@/components/AboutPopup.vue'
import LogoTop from '@/components/LogoTop.vue'
import LogoBottom from '@/components/LogoBottom.vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import ProjectIndex from '@/components/ProjectIndex.vue'
import ProjectNavigation from '@/components/ProjectNavigation.vue'
// etc.
```

**Component naming for subdirectories:** Nuxt prefixes component names with the directory path by default:
- `components/Hero.vue` → `<Hero />`  (top-level — no prefix)
- `components/icons/ChevronDown.vue` → `<IconsChevronDown />`
- `components/admin/ProjectEditor.vue` → `<AdminProjectEditor />`
- `components/admin/SettingsSidebar.vue` → `<AdminSettingsSidebar />`
- `components/admin/ProjectPopupPreview.vue` → `<AdminProjectPopupPreview />`

If you prefer the current short names (e.g. `<ProjectEditor />` instead of `<AdminProjectEditor />`), add `pathPrefix: false` in `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  components: [
    { path: '~/components', pathPrefix: false },
  ],
})
```

**Trade-off:** `pathPrefix: false` is simpler but risks name collisions if two subdirectories have files with the same name. The default path-prefix approach is safer and more explicit.

### 6.6 — Path aliases: `@/` and `~/` both work

In Nuxt 4, **both `@/` and `~/`** are aliased to the `app/` directory by default. This means existing `@/` imports will continue to work without changes. The Nuxt convention is `~/`, but switching is optional.

The only required update is for the renamed plugin file:

```typescript
// BEFORE
import pb from '@/plugins/pocketbase'

// AFTER (file was renamed to .client.ts in Phase 4.1)
import pb from '@/plugins/pocketbase.client'
// or equivalently:
import pb from '~/plugins/pocketbase.client'
```

> **Note:** Most explicit imports will be removed by auto-imports anyway (Phase 6.1–6.5). The `@/` or `~/` alias is only needed for imports that Nuxt does NOT auto-import: plugin files, asset files (images, SVGs, CSS), and type-only imports from `shared/types/`.

### 6.7 — Type imports from `shared/types/`

Types exported from plugin files and `shared/types/` are **not** auto-imported by default. Keep explicit type imports but update the alias:

```typescript
// BEFORE
import type { PortfolioProject } from '@/plugins/pocketbase'

// AFTER
import type { PortfolioProject } from '~/plugins/pocketbase.client'
```

To auto-import types from `shared/types/`, add the directory to the imports scan in `nuxt.config.ts`:
```typescript
// nuxt.config.ts — optional
imports: {
  dirs: ['shared/types'],
},
```

This makes all named type exports from `shared/types/*.ts` globally available without import statements.

---

## Phase 7 — `useHead()` for Dynamic Head

Replace direct DOM manipulation for the favicon with Nuxt's `useHead()` composable.

### 7.1 — Refactor `useFaviconCache.ts`

```typescript
// app/composables/useFaviconCache.ts
export function useFaviconCache(settingsRef: Ref<Settings | null>) {
  const faviconHref = ref<string>('')

  // useHead is auto-imported by Nuxt
  useHead({
    link: [
      { rel: 'icon', type: 'image/png', href: faviconHref },
    ],
  })

  watch(settingsRef, (settings) => {
    if (!settings || !settings.favicon) return

    const faviconUrl = getImageUrl(settings, settings.favicon)
    const cacheKey = 'favicon_cache'
    const versionKey = 'favicon_version'
    const cachedVersion = localStorage.getItem(versionKey)
    const cachedFavicon = localStorage.getItem(cacheKey)

    if (cachedVersion === settings.updated && cachedFavicon) {
      faviconHref.value = cachedFavicon
      return
    }

    fetch(faviconUrl)
      .then(r => r.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const dataUrl = reader.result as string
          try {
            localStorage.setItem(cacheKey, dataUrl)
            localStorage.setItem(versionKey, settings.updated)
          } catch (e) {
            console.warn('Failed to cache favicon:', e)
          }
          faviconHref.value = dataUrl
        }
        reader.readAsDataURL(blob)
      })
      .catch(() => {
        faviconHref.value = `${faviconUrl}?v=${settings.updated}`
      })
  }, { immediate: true })
}
```

This replaces the manual DOM manipulation (`document.createElement('link')`, `document.head.appendChild`) in both `useFaviconCache.ts` and the duplicate logic in `Home.vue`. The favicon `watch` block in `Home.vue` (lines 146–191) should be **deleted** and replaced with a single call:

```typescript
// In pages/index.vue (formerly Home.vue), replace the favicon watch block with:
useFaviconCache(settingsData)
```

---

## Phase 8 — Layouts (Optional)

The current app has no layouts. This is optional but recommended for separating the public portfolio layout from the admin layout.

### 8.1 — Default layout (portfolio)

```vue
<!-- app/layouts/default.vue -->
<template>
  <slot />
</template>
```

### 8.2 — Admin layout

If you want shared admin chrome (header, sidebar), create:

```vue
<!-- app/layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-neutral-950">
    <slot />
  </div>
</template>
```

Then in admin pages:
```typescript
definePageMeta({
  layout: 'admin',
})
```

This is entirely optional — the app works without layouts.

---

## Phase 9 — Cleanup & Verification

### 9.1 — Files to delete

- `vue/` directory (now `app/`)
- `index.html`
- `vite.config.ts`
- `tsconfig.json`, `tsconfig.vue.json`, `tsconfig.node.json`
- `vue/main.ts`
- `vue/env.d.ts`
- `vue/router/` directory

### 9.2 — Files added to `.gitignore`

```
.nuxt/
.output/
node_modules/
```

### 9.3 — Run and verify

```bash
npm install
npx nuxt prepare     # Generates .nuxt/ types
npm run dev           # Should start on localhost:5174
```

### 9.4 — Verification checklist

- [ ] Portfolio page loads at `/` with scroll-snap sections
- [ ] Hero section renders with PocketBase image
- [ ] Carousels scroll horizontally with blur effect
- [ ] Project popup opens/closes with scale animation
- [ ] About popup opens from logo click
- [ ] Hamburger menu works with `<Teleport>`
- [ ] Project index anchor links navigate correctly
- [ ] Favicon loads dynamically from PocketBase
- [ ] Admin login at `/admin` authenticates correctly
- [ ] Auth guard redirects unauthenticated users from `/admin/dashboard`
- [ ] Admin dashboard: project CRUD, drag-reorder, hero image upload
- [ ] Settings sidebar updates font sizes, favicon, about content
- [ ] Toast notifications appear and auto-dismiss
- [ ] Real-time PocketBase subscriptions update data
- [ ] Mobile responsive behavior (isMobile/isDesktop breakpoints)
- [ ] Edge gesture prevention on iOS
- [ ] Safari scroll-snap CSS custom properties set correctly

---

## Execution Order Summary

| Step | Phase | What to do |
|---|---|---|
| 1 | 1.1 | Install `nuxt`, `@vueuse/nuxt`, `@nuxt/eslint`. Remove `vue`, `vue-router`, `@vitejs/plugin-vue`, `vue-tsc` |
| 2 | 1.2 | Create `nuxt.config.ts` |
| 3 | 1.3 | Update `package.json` scripts |
| 4 | 1.5 | Update `tailwind.config.js` content paths |
| 5 | 2 | Rename `vue/` → `app/` |
| 6 | 3.1 | Rename page files for file-based routing |
| 7 | 3.2 | Delete `app/router/` directory |
| 8 | 3.3 | Update `app.vue` (`<router-view>` → `<NuxtPage>`) |
| 9 | 4.1 | Rename `pocketbase.ts` → `pocketbase.client.ts` |
| 10 | 4.2 | Create `plugins/sentry.client.ts` |
| 11 | 5 | Create `middleware/auth.ts`, add `definePageMeta` to dashboard page |
| 12 | 6 | Remove manual imports across all files, update `@/` → `~/` |
| 13 | 7 | Refactor `useFaviconCache` to use `useHead()` |
| 14 | 3.4 | Replace `import { useRouter } from 'vue-router'` with auto-imported `useRouter`/`navigateTo` |
| 15 | 1.4 | Delete `index.html`, `vite.config.ts`, `tsconfig*.json`, `main.ts`, `env.d.ts`, `router/` |
| 16 | 9 | Run `nuxt prepare`, `npm run dev`, verify checklist |

---

## Dependency Changes

| Purpose | Current (Vue) | Nuxt |
|---|---|---|
| Framework | `vue` | `nuxt` (includes vue) |
| Routing | `vue-router` | Built into Nuxt |
| Build tool | `vite` + `@vitejs/plugin-vue` | Built into Nuxt |
| Type checking | `vue-tsc` | `nuxi typecheck` (built-in) |
| VueUse | `@vueuse/core` | `@vueuse/nuxt` + `@vueuse/core` |
| Error tracking | `@sentry/vue` | `@sentry/vue` (unchanged) |
| Linting | `@antfu/eslint-config` | `@nuxt/eslint` (or keep antfu) |
| PocketBase | `pocketbase` | `pocketbase` (unchanged) |
| Animations | `@vueuse/motion` | `@vueuse/motion` (unchanged) |
| Drag reorder | `sortablejs` + `@vueuse/integrations` | unchanged |

---

## Key Nuxt Conventions to Remember

1. **Auto-imports**: Vue APIs (`ref`, `computed`, `watch`...), composables from `composables/`, utils from `utils/`, and components from `components/` are all auto-imported. No import statements needed.
2. **File-based routing**: `pages/index.vue` → `/`, `pages/admin/index.vue` → `/admin`, `pages/admin/dashboard.vue` → `/admin/dashboard`.
3. **`~/` alias**: Replaces `@/`. Points to the `app/` directory.
4. **`.client.ts` suffix**: Plugins with `.client.ts` only run on the client side.
5. **`definePageMeta()`**: Compiler macro for page-level config (middleware, layout). No import needed.
6. **`defineNuxtPlugin()`**: Wrapper for plugins. Auto-imported.
7. **`defineNuxtRouteMiddleware()`**: Wrapper for route middleware. Auto-imported.
8. **`useHead()`**: Reactive head management. Replaces manual DOM manipulation for `<title>`, `<link>`, `<meta>`.
9. **`navigateTo()`**: Replaces `router.push()`. Auto-imported.
10. **`<NuxtPage />`**: Replaces `<router-view />`. Auto-imported.
