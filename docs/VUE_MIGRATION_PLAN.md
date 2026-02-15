# Vue Migration Plan — Add Vue Version Alongside React

## Structure

```
/home/user/Joannavdw-2-copy/
├── src/                        # React app (untouched)
├── vue/                        # Vue app (Nuxt-inspired structure)
│   ├── app.vue                 # Router shell (<router-view />)
│   ├── main.ts
│   ├── env.d.ts                # TypeScript/Vite declarations for .vue files
│   ├── assets/                 # Processed assets — SVGs, images, CSS
│   │   ├── css/
│   │   │   └── main.css        # Global styles (Tailwind, scroll-snap, GPU accel)
│   │   ├── logo svg/
│   │   │   ├── Asset 7.svg
│   │   │   └── Asset 11.svg
│   │   ├── Project Card/
│   │   │   └── JVDW WEB LIGHT BOX copy.svg
│   │   └── admin-login-bg.jpg
│   ├── components/
│   │   ├── Hero.vue
│   │   ├── HeroMobile.vue
│   │   ├── MotionCarousel.vue
│   │   ├── MotionCarouselDesktop.vue
│   │   ├── ProjectPopup.vue
│   │   ├── AboutPopup.vue
│   │   ├── LogoTop.vue
│   │   ├── LogoBottom.vue
│   │   ├── HamburgerMenu.vue
│   │   ├── ProjectIndex.vue
│   │   ├── ProjectNavigation.vue
│   │   ├── icons/
│   │   │   ├── ChevronDown.vue
│   │   │   └── ChevronRight.vue
│   │   └── admin/
│   │       ├── ProjectEditor.vue
│   │       ├── SettingsSidebar.vue
│   │       └── ProjectPopupPreview.vue
│   ├── composables/
│   │   ├── usePocketBase.ts    # Custom — PB SDK + useStorage + tryOnScopeDispose
│   │   ├── useFaviconCache.ts  # Custom — useFavicon + useLocalStorage + fetch/blob
│   │   └── useToast.ts         # Custom — useTimeoutFn + reactive toast array
│   ├── layouts/                # Future layout components (placeholder)
│   ├── middleware/              # Future route middleware (placeholder)
│   ├── pages/
│   │   ├── Home.vue            # Portfolio orchestrator (equivalent of React App.tsx logic)
│   │   └── admin/
│   │       ├── AdminLogin.vue
│   │       └── AdminDashboard.vue
│   ├── plugins/
│   │   └── pocketbase.ts       # PB client, cache, helpers
│   ├── router/
│   │   └── index.ts
│   ├── shared/
│   │   └── types/
│   │       ├── pocketbase-types.ts # Generated PB types
│   │       └── project.ts          # ProjectImage interface
│   └── utils/
│       └── sharedStyles.ts     # Tailwind class strings
├── index-vue.html              # Vue entry HTML
├── vite.config.vue.ts          # Vue-specific Vite config
│
│   # Shared infrastructure (NOT imported cross-framework)
├── public/                     # Fonts, manifest
├── tailwind.config.js          # Content paths include both src/ and vue/
├── package.json                # Both React + Vue deps
```

## Phase 1 — Setup

Add Vue deps, create `vite.config.vue.ts`, `index-vue.html`, `vue/main.ts`, `vue/router/index.ts`, and `dev:vue`/`build:vue` npm scripts. Update Tailwind content paths for `vue/` files.

DONE

## Phase 2 — Shared Code Imports

Verified that PocketBase config, types, utils, and assets all resolve when imported from `src/`. Scoped React Vite config to avoid scanning Vue files.

DONE — superseded by Phase 3.1: shared code is now duplicated into `vue/` and the `@` alias points to `vue/` instead of `src/`. Vue no longer imports from the React directory.

## Phase 3 — Decouple & Component Migration

### Phase 3.0 — Install Vue packages

```bash
npm install @vueuse/motion @vueuse/core @vueuse/integrations sortablejs
```

### Phase 3.1 — Decouple Vue from React `src/`

No Vue file should import from `src/`. Duplicate framework-agnostic code into `vue/`.

**Duplicate into `vue/`:**

| Source | Destination | Notes |
|---|---|---|
| `src/config/pocketbase.ts` | `vue/plugins/pocketbase.ts` | Verbatim — pure TS + PocketBase SDK |
| `src/types/pocketbase-types.ts` | `vue/shared/types/pocketbase-types.ts` | Verbatim — auto-generated types |
| `src/types/project.ts` | `vue/shared/types/project.ts` | Verbatim — `ProjectImage` interface |
| `src/utils/sharedStyles.ts` | `vue/utils/sharedStyles.ts` | Verbatim — Tailwind class strings |
| `src/assets/logo svg/` | `vue/assets/logo svg/` | 2 SVG logos |
| `src/assets/Project Card/` | `vue/assets/Project Card/` | 1 SVG card background |
| `src/assets/admin-login-bg.jpg` | `vue/assets/admin-login-bg.jpg` | Admin login background |

**Update `vite.config.vue.ts`:**
- Change `@` alias: `resolve(__dirname, 'src')` → `resolve(__dirname, 'vue')`
- Remove `~vue` alias (redundant once `@` points to `vue/`)

**Update existing Vue file imports:**
- `vue/main.ts`: `import '@/assets/css/main.css'` for global styles
- `vue/pages/Home.vue`: `@/plugins/pocketbase` resolves to `vue/plugins/pocketbase.ts` automatically
- Type imports: `@/shared/types/pocketbase-types` and `@/shared/types/project`
- Asset imports: `@/assets/logo svg/Asset 7.svg` resolves to `vue/assets/`

**Maintenance:** When PocketBase schema changes, run `typegen` and copy the output to both `src/types/` and `vue/shared/types/`.

### Phase 3.2 — Component Migration

All Vue components import from `vue/plugins`, `vue/shared/types`, `vue/utils`, and `vue/assets` — never from `src/`.

| React | Vue | Key Notes |
|---|---|---|
| `Hero.tsx` | `Hero.vue` | `motion/react` → `@vueuse/motion` |
| `HeroMobile.tsx` | `HeroMobile.vue` | Same animation approach |
| `MotionCarousel.tsx` | `MotionCarousel.vue` | Scroll-snap CSS + scroll listeners via template refs |
| `MotionCarouselDesktop.tsx` | `MotionCarouselDesktop.vue` | Same + `@keydown` for arrow keys |
| `ProjectPopup.tsx` | `ProjectPopup.vue` | `AnimatePresence` → `<Transition>`, custom `--scale` CSS prop |
| `AboutPopup.tsx` | `AboutPopup.vue` | Same `<Transition>` pattern |
| `LogoTop.tsx` | `LogoTop.vue` | CSS `transition` on `top` property |
| `LogoBottom.tsx` | `LogoBottom.vue` | Same |
| `HamburgerMenu.tsx` | `HamburgerMenu.vue` | `createPortal` → `<Teleport to="body">` |
| `ProjectIndex.tsx` | `ProjectIndex.vue` | Anchor links, no custom logic |
| `ProjectNavigation.tsx` | `ProjectNavigation.vue` | `onClick` callback → `@click` emit |
| `ChevronDown.tsx` | `icons/ChevronDown.vue` | `defineProps()` |
| `ChevronRight.tsx` | `icons/ChevronRight.vue` | Same |
| `App.tsx` (routing shell) | `app.vue` | Done — bare `<router-view />` |
| `App.tsx` (portfolio logic) | `pages/Home.vue` | Orchestrator: PocketBase fetching, real-time subscriptions, popup state, section tracking, favicon caching. `useState` → `ref()`, `useEffect` → `onMounted()`/`watch()` |

**Note on CarouselContext:** `CLAUDE.md` references a `CarouselContext` using React Context. This is outdated — the codebase uses **no Context API**. Carousel state (`scrollProgress`, `currentSlide`, `blurIntensity`) is computed locally inside each carousel component from scroll events. Communication uses props and callbacks. The Vue version follows the same pattern: local state via `useScroll` + `computed()`, props/emits for parent communication. No `provide`/`inject` needed.

### Phase 3.3 — Edge Gesture Prevention

Blocks browser back-swipe on iOS/Safari when touching near the left screen edge.

In `Home.vue`, use `useEventListener` from `@vueuse/core`:

```typescript
import { useEventListener } from '@vueuse/core'

useEventListener(document, 'touchstart', (e: TouchEvent) => {
  const touch = e.touches[0]
  if (touch && touch.clientX < 50) {
    const carousel = (e.target as Element)?.closest('[data-carousel]')
    if (!carousel) {
      e.preventDefault()
    }
  }
}, { passive: false })
```

### Phase 3.4 — Migration Order

1. Icons (`ChevronDown.vue`, `ChevronRight.vue`) — no dependencies
2. `Home.vue` skeleton — PocketBase fetch + section structure, renders raw data
3. `LogoTop.vue`, `LogoBottom.vue` — CSS transition on `top`
4. `Hero.vue`, `HeroMobile.vue` — `@vueuse/motion` scale animation
5. `MotionCarousel.vue`, `MotionCarouselDesktop.vue` — scroll-snap + scroll state
6. `ProjectPopup.vue`, `AboutPopup.vue`, `HamburgerMenu.vue` — `<Transition>` / `<Teleport>`
7. `ProjectIndex.vue`, `ProjectNavigation.vue`
8. Wire into `Home.vue` — popup state, section tracking, edge gesture prevention

## Phase 4 — Composables (replacing React patterns)

### Direct from VueUse

Use directly in components — no custom wrappers needed.

| React pattern | VueUse replacement | Usage |
|---|---|---|
| `useState(isMobile)` + `resize` listener | `useBreakpoints` | `const bp = useBreakpoints({ mobile: 0, tablet: 640, desktop: 1024 })`; `bp.smaller('tablet')` → `isMobile`; `bp.greaterOrEqual('desktop')` → `isDesktop`. Uses `matchMedia` internally. Tailwind preset available. |
| `IntersectionObserver` setup + cleanup | `useIntersectionObserver` | `useIntersectionObserver(sectionRef, callback, { threshold: 0.5 })`. Auto-cleans up on unmount. Supports `pause()`/`resume()`. |
| Scroll listener + `scrollLeft` tracking | `useScroll` | `const { x, isScrolling, arrivedState, directions } = useScroll(carouselRef, { throttle: 5 })`. `x` is a **writable** ref — assigning to it scrolls programmatically. Derive `scrollProgress` and `currentSlide` as `computed()` wrappers over `x`. |
| `document.addEventListener('touchstart', ...)` | `useEventListener` | `useEventListener(document, 'touchstart', handler, { passive: false })`. Auto-cleans up on unmount. |

### Custom composables (built on VueUse primitives)

**`usePocketBase()`** — data fetching, caching, real-time subscriptions

Wraps the PocketBase JS SDK with Vue reactivity.

- **Caching**: `useStorage` for localStorage persistence with cross-tab sync and custom serializers. Replaces `getCachedData`/`setCachedData`.
- **Cleanup**: `tryOnScopeDispose` to unsubscribe PocketBase real-time listeners on unmount.
- **Data**: Returns reactive `ref()` values for `projectsData`, `homepageData`, `aboutData`, `settingsData`.
- **Subscriptions**: PocketBase SDK's `.subscribe('*', callback)` directly — PocketBase uses SSE, so VueUse's `useWebSocket`/`useEventSource` don't apply.
- **Error handling**: Auth-aware (401/403 → clear auth → redirect via `vue-router`).

**`useFaviconCache(settingsData)`** — favicon with version-aware caching

Combines three VueUse composables:

- **`useFavicon`**: Reactively sets the `<link rel="icon">` href. Returns a writable ref.
- **`useLocalStorage`**: Stores the base64-encoded favicon with a version key. Invalidation by changing the key (e.g. `favicon-v${settings.updated}`).
- **Fetch + blob conversion**: `fetch()` the favicon URL → `.blob()` → convert to data URL via `FileReader` or VueUse's `useBase64`. Cache the result.

Flow: check cache version → hit or fetch → convert → store → set favicon.

**`useToast()`** — notification state with auto-dismiss

- **`useTimeoutFn`**: Per-toast auto-dismiss timer with `start()`/`stop()` control.
- **Custom state**: reactive `ref<Toast[]>([])` array, `addToast(message, type)` and `removeToast(id)` functions.
- Types: `{ id: number, message: string, type: 'success' | 'error' }`.

## Phase 5 — Animation Strategy

### Keyframe / Transition animations

- **Scale/opacity entrances** (Hero) → `@vueuse/motion` or Vue `<Transition>` with CSS `@keyframes`
- **AnimatePresence** → built-in `<Transition>`/`<TransitionGroup>` with `v-if`/`v-show`
- **Logo position animation** → CSS `transition: top 1.2s ease-out` toggled by prop

### Custom CSS property animation (popups)

React animates a custom CSS property `--scale` via `motion/react`:

```typescript
// React pattern:
initial={{ '--scale': 0.8, 'opacity': 0 }}
animate={{ '--scale': 1, 'opacity': 1 }}
exit={{ '--scale': 0.8, 'opacity': 0 }}

// Applied via:
style={{ transform: 'translate(-50%, -50%) scale(var(--scale, 1))' }}
```

This prevents the animation library from overriding the `translate(-50%, -50%)` centering transform. In Vue, use `<Transition>` with CSS classes that animate `--scale`:

```css
.popup-enter-active, .popup-leave-active {
  transition: --scale 0.3s ease-out, opacity 0.3s ease-out;
}
.popup-enter-from, .popup-leave-to {
  --scale: 0.8;
  opacity: 0;
}
.popup-enter-to, .popup-leave-from {
  --scale: 1;
  opacity: 1;
}
```

The `transform: translate(-50%, -50%) scale(var(--scale, 1))` stays as an inline style, not touched by transition classes.

### Scroll-driven reactive styles (carousel blur)

The carousel blur is a reactive computed value driven by scroll position, not a keyframe or transition:

```typescript
style={{ backdropFilter: `blur(${8 * blurIntensity}px)` }}
```

In Vue, derive `blurIntensity` as a `computed()` from `useScroll`'s reactive `x` value (see Phase 4), then bind directly:

```vue
<div :style="{ backdropFilter: `blur(${8 * blurIntensity}px)` }" />
```

No animation library needed — reactive computation only.

### Drag reorder (admin)

React uses `motion/react`'s `<Reorder.Group>` / `<Reorder.Item>` with `whileDrag={{ scale: 1.01, boxShadow: '...' }}`.

Vue: `useSortable` from `@vueuse/integrations` (wraps SortableJS).

Differences from React's Reorder API:
- `useSortable` provides `animation: 200` for smooth reorder transitions
- No built-in `whileDrag` style — use SortableJS's `onStart`/`onEnd` callbacks or CSS classes (`.sortable-drag`, `.sortable-ghost`)
- Returns `start()`, `stop()`, and `option()` for runtime control

## Phase 6 — Admin Pages

### Route guard

React checks `pb.authStore.isValid` on mount in `AdminDashboard.tsx`. Vue uses `vue-router` navigation guards:

```typescript
// router/index.ts
{
  path: '/admin/dashboard',
  component: () => import('../pages/admin/AdminDashboard.vue'),
  beforeEnter: () => {
    if (!pb.authStore.isValid) return '/admin'
  },
}
```

### Lazy-loaded routes

All admin pages lazy-loaded with `() => import()` (configured in `vue/router/index.ts`).

### Component notes

**`AdminLogin.vue`**

- React uses `isMountedRef` to prevent `setState` after unmount during async auth. Vue 3 does not require this — use `onUnmounted` + a cancellation flag instead.
- Auth flow: `pb.collection('users').authWithPassword()` → navigate to `/admin/dashboard`.

**`AdminDashboard.vue`**

- **Drag-to-reorder projects**: Replace `<Reorder.Group>` with `useSortable`. On reorder, batch-update PocketBase with `Promise.all` using `requestKey: null` to prevent auto-cancellation:
  ```typescript
  const updates = newOrder.map((project, i) =>
    pb.collection('Portfolio_Projects').update(project.id, { Order: i + 1 }, { requestKey: null })
  )
  await Promise.all(updates)
  ```
- **Toast notifications**: Use `useToast()` composable for CRUD feedback.
- **Project CRUD**: Create/delete via PocketBase SDK with FormData.

**`ProjectEditor.vue`**

- **Image reordering**: PocketBase does not preserve array order on update. Workaround: (1) delete all existing images from the record, (2) download existing images as blobs, (3) re-upload all images (existing + new) in desired order via FormData. Preserve this pattern in Vue.
- **Form state**: Tracks each image as `{ src: string, file?: File, isExisting: boolean }`. New uploads use `URL.createObjectURL(file)` for preview. Existing images use PocketBase file URLs.
- **File input handling**: Hidden `<input type="file">` triggered by button clicks via template refs.
- **FormData construction**: Multiple `formData.append('Images', file)` calls for multi-image upload.

**`SettingsSidebar.vue`**

- Form state for hero title, responsive font sizes, checkboxes, client list.
- Favicon upload with file input ref.
- Settings update via PocketBase SDK.

**`ProjectPopupPreview.vue`**

- Uses the same `--scale` custom CSS property animation as `ProjectPopup.vue` (see Phase 5).
- SVG background image import from `vue/assets/`.

## Execution Order

1. Phase 1 (scaffolding) — blank Vue app running alongside React
2. Phase 2 (shared imports) — confirm Vue can use `src/` code
3. Phase 3.0 — install `@vueuse/motion`, `@vueuse/core`, `@vueuse/integrations`, `sortablejs`
4. Phase 3.1 — decouple: duplicate config/types/utils/assets into `vue/`, update Vite alias
5. Phase 3.2–3.4 — icons → Home.vue skeleton → logos → hero → carousels → popups → full wiring
6. Phases 4–5 happen alongside Phase 3.2–3.4
7. Phase 6 (admin) — route guards, drag reorder, image reordering, ProjectEditor

## Key Dependency Changes

| Purpose | React | Vue |
|---|---|---|
| Framework | `react`, `react-dom` | `vue` |
| Routing | `react-router-dom` | `vue-router` |
| Vite plugin | `@vitejs/plugin-react` | `@vitejs/plugin-vue` |
| Animations | `motion` | `@vueuse/motion` + `@vueuse/core` |
| Error tracking | `@sentry/react` | `@sentry/vue` |
| Linting | `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` | `eslint-plugin-vue` |
| Drag reorder | `motion` Reorder API | `useSortable` (`@vueuse/integrations` + `sortablejs`) |

## VueUse Primitives Inventory

Every VueUse composable used in this migration, its package, purpose, and location.

### `@vueuse/core`

| Composable | Purpose | Used in |
|---|---|---|
| `useBreakpoints` | Reactive viewport breakpoint tracking via `matchMedia`. Tailwind preset available. | `Home.vue`, any component needing responsive logic |
| `useIntersectionObserver` | Wraps native IntersectionObserver with auto-cleanup. `threshold: 0.5` for section visibility. | `Home.vue` (section tracking) |
| `useScroll` | Reactive scroll position (`x`, `y`), `isScrolling`, `arrivedState`, `directions`. `x` is writable for programmatic scrolling. `throttle` option for debouncing. | `MotionCarousel.vue`, `MotionCarouselDesktop.vue` |
| `useEventListener` | Auto-cleaning event listener. | `Home.vue` (edge gesture prevention) |
| `useStorage` | Reactive localStorage with cross-tab sync and custom serializers. | `usePocketBase` composable (response caching) |
| `useLocalStorage` | Shorthand for `useStorage` with localStorage. | `useFaviconCache` composable (favicon base64 caching) |
| `useFavicon` | Reactively sets `<link rel="icon">` href. Returns writable ref. | `useFaviconCache` composable |
| `useBase64` | Converts Blob/File to base64 string. | `useFaviconCache` composable (favicon blob → data URL) |
| `useTimeoutFn` | Controllable timeout with `start()`/`stop()`/`isPending`. | `useToast` composable (auto-dismiss timers) |
| `tryOnScopeDispose` | Cleanup hook that works inside and outside component lifecycle. | `usePocketBase` composable (subscription cleanup) |

### `@vueuse/integrations`

| Composable | Purpose | Used in |
|---|---|---|
| `useSortable` | Wraps SortableJS for drag-and-drop list reordering. `animation: 200` for transitions. CSS classes `.sortable-drag`/`.sortable-ghost` for drag styles. | `AdminDashboard.vue` (project reorder) |

### `@vueuse/motion`

| Composable | Purpose | Used in |
|---|---|---|
| `useMotion` / `v-motion` directive | Declarative enter/leave animations (scale, opacity, position). Replaces `motion/react`'s `<motion.div>`. | `Hero.vue`, `HeroMobile.vue` |
