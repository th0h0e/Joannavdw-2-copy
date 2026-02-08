# Vue Migration Plan — Add Vue Version Alongside React

## Structure

```
/home/user/Joannavdw-2-copy/
├── src/                        # React app (untouched)
├── vue/                        # Vue app (fully self-contained)
│   ├── App.vue                 # Router shell (<router-view />)
│   ├── main.ts
│   ├── config/
│   │   └── pocketbase.ts       # Own copy — PB client, cache, helpers
│   ├── types/
│   │   ├── pocketbase-types.ts # Own copy — generated PB types
│   │   └── project.ts          # Own copy — ProjectImage interface
│   ├── utils/
│   │   └── sharedStyles.ts     # Own copy — Tailwind class strings
│   ├── assets/                 # Own copy — SVGs, images
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
│   ├── pages/
│   │   ├── Home.vue            # Portfolio orchestrator (equivalent of React App.tsx logic)
│   │   └── admin/
│   │       ├── AdminLogin.vue
│   │       └── AdminDashboard.vue
│   ├── composables/            # Vue equivalents of React hooks
│   │   ├── usePocketBase.ts    # Custom — PB SDK + useStorage + tryOnScopeDispose
│   │   ├── useFaviconCache.ts  # Custom — useFavicon + useLocalStorage + fetch/blob
│   │   └── useToast.ts         # Custom — useTimeoutFn + reactive toast array
│   └── router/
│       └── index.ts
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

The Vue app must be fully self-contained. No Vue file should import from `src/` (the React app). Duplicate framework-agnostic code into `vue/` so neither app depends on the other's directory.

**Duplicate into `vue/`:**

| Source | Destination | Notes |
|---|---|---|
| `src/config/pocketbase.ts` | `vue/config/pocketbase.ts` | Verbatim — pure TS + PocketBase SDK, no React |
| `src/types/pocketbase-types.ts` | `vue/types/pocketbase-types.ts` | Verbatim — auto-generated types |
| `src/types/project.ts` | `vue/types/project.ts` | Verbatim — `ProjectImage` interface |
| `src/utils/sharedStyles.ts` | `vue/utils/sharedStyles.ts` | Verbatim — Tailwind class strings |
| `src/assets/logo svg/` | `vue/assets/logo svg/` | 2 SVG logos |
| `src/assets/Project Card/` | `vue/assets/Project Card/` | 1 SVG card background |
| `src/assets/admin-login-bg.jpg` | `vue/assets/admin-login-bg.jpg` | Admin login background |

**Update `vite.config.vue.ts`:**
- Change `@` alias: `resolve(__dirname, 'src')` → `resolve(__dirname, 'vue')` — Vue code resolves to itself
- Remove `~vue` alias (no longer needed, `@` already points to `vue/`)

**Update existing Vue file imports:**
- `vue/main.ts`: keep `import '../src/index.css'` → change to `import './index.css'` after copying Tailwind entry CSS into `vue/` (or keep the relative import to the shared Tailwind config — either approach is fine since `index.css` is just Tailwind directives)
- `vue/pages/Home.vue`: imports like `@/config/pocketbase` now resolve to `vue/config/pocketbase.ts` automatically
- Asset imports: `@/assets/logo svg/Asset 7.svg` now resolves to `vue/assets/`

**Maintenance note:** When PocketBase schema changes, run `typegen` and copy the output to both `src/types/` and `vue/types/`.

### Phase 3.2 — Component Migration

Vue components live in `vue/components/` and import from `vue/config`, `vue/types`, `vue/utils`, and `vue/assets` — never from `src/`.

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
| `ProjectIndex.tsx` | `ProjectIndex.vue` | Straightforward |
| `ProjectNavigation.tsx` | `ProjectNavigation.vue` | `onClick` callback → `@click` emit |
| `ChevronDown.tsx` | `icons/ChevronDown.vue` | `defineProps()` |
| `ChevronRight.tsx` | `icons/ChevronRight.vue` | Same |
| `App.tsx` (routing shell) | `App.vue` | Already done — bare `<router-view />` |
| `App.tsx` (portfolio logic) | `pages/Home.vue` | The orchestrator: PocketBase data fetching, real-time subscriptions, popup state, section tracking, favicon caching. `useState` → `ref()`, `useEffect` → `onMounted()`/`watch()` |

**Note on CarouselContext:** The project's `CLAUDE.md` references a `CarouselContext` using React Context for carousel state management. This is outdated — the actual React codebase uses **no Context API**. All carousel state (`scrollProgress`, `currentSlide`, `blurIntensity`) is computed locally inside each carousel component from native scroll events, and communication between components uses props and callbacks only. The Vue version should follow the same pattern: local reactive state within each carousel component via `useScroll` + `computed()`, with props/emits for parent communication. No `provide`/`inject` is needed.

### Phase 3.3 — Edge Gesture Prevention

Vue equivalent of React's `preventEdgeNavigation` — blocks browser back-swipe on iOS/Safari when touching near the left screen edge.

In `Home.vue`, use `useEventListener` from `@vueuse/core` (auto-cleans up on unmount, no manual `removeEventListener` needed):

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

Build components in this order so each step is testable:

1. Icons (`ChevronDown.vue`, `ChevronRight.vue`) — trivial, no dependencies
2. `Home.vue` skeleton — PocketBase fetch + section structure, renders raw data
3. `LogoTop.vue`, `LogoBottom.vue` — simple CSS transition
4. `Hero.vue`, `HeroMobile.vue` — `@vueuse/motion` scale animation
5. `MotionCarousel.vue`, `MotionCarouselDesktop.vue` — scroll-snap + scroll state
6. `ProjectPopup.vue`, `AboutPopup.vue`, `HamburgerMenu.vue` — `<Transition>` / `<Teleport>`
7. `ProjectIndex.vue`, `ProjectNavigation.vue` — straightforward
8. Wire everything into `Home.vue` — full orchestrator with popup state, section tracking, edge gesture prevention

## Phase 4 — Composables (replacing React patterns)

### Direct from VueUse (no custom composable needed)

These VueUse composables are drop-in replacements. Use them directly in components instead of writing custom wrappers.

| React pattern | VueUse replacement | Usage |
|---|---|---|
| `useState(isMobile)` + `resize` listener | `useBreakpoints` | `const bp = useBreakpoints({ mobile: 0, tablet: 640, desktop: 1024 })`; `bp.smaller('tablet')` → `isMobile`; `bp.greaterOrEqual('desktop')` → `isDesktop`. Uses `matchMedia` internally — more performant than resize listeners. Tailwind preset available. |
| `IntersectionObserver` setup + cleanup | `useIntersectionObserver` | Wrap each section ref with `useIntersectionObserver(sectionRef, callback, { threshold: 0.5 })`. Auto-cleans up on unmount. Supports `pause()`/`resume()`. |
| Scroll listener + `scrollLeft` tracking | `useScroll` | `const { x, isScrolling, arrivedState, directions } = useScroll(carouselRef, { throttle: 5 })`. `x` is a **writable** ref — assigning to it scrolls programmatically. Derive `scrollProgress` and `currentSlide` as trivial `computed()` wrappers over `x`. |
| `document.addEventListener('touchstart', ...)` | `useEventListener` | `useEventListener(document, 'touchstart', handler, { passive: false })`. Auto-cleans up on unmount. |

### Custom composables (built on VueUse primitives)

These require custom logic but leverage VueUse building blocks.

**`usePocketBase()`** — data fetching, caching, real-time subscriptions

The most complex composable. Wraps the PocketBase JS SDK with Vue reactivity.

- **Caching**: `useStorage` from VueUse for localStorage persistence with cross-tab sync and custom serializers. Replaces the manual `getCachedData`/`setCachedData` helpers.
- **Cleanup**: `tryOnScopeDispose` from VueUse to unsubscribe PocketBase real-time listeners on unmount. Replaces the `useEffect` cleanup return.
- **Data**: Returns reactive `ref()` values for `projectsData`, `homepageData`, `aboutData`, `settingsData`.
- **Subscriptions**: Uses PocketBase SDK's `.subscribe('*', callback)` directly — PocketBase uses SSE internally, so VueUse's `useWebSocket`/`useEventSource` don't apply here.
- **Error handling**: Auth-aware (401/403 → clear auth → redirect via `vue-router`).

**`useFaviconCache(settingsData)`** — favicon with version-aware caching

Combines three VueUse composables:

- **`useFavicon`**: Reactively sets the `<link rel="icon">` href. Returns a writable ref.
- **`useLocalStorage`**: Stores the base64-encoded favicon with a version key. Invalidation by changing the key (e.g. `favicon-v${settings.updated}`).
- **Fetch + blob conversion**: `fetch()` the favicon URL → `.blob()` → convert to data URL via `FileReader` or VueUse's `useBase64`. Cache the result.

Custom orchestration: check cache version → hit or fetch → convert → store → set favicon.

**`useToast()`** — notification state with auto-dismiss

- **`useTimeoutFn`** from VueUse: per-toast auto-dismiss timer with `start()`/`stop()` control. Replaces manual `setTimeout`/`clearTimeout`.
- **Custom state**: reactive `ref<Toast[]>([])` array, `addToast(message, type)` and `removeToast(id)` functions.
- Types: `{ id: number, message: string, type: 'success' | 'error' }`.

## Phase 5 — Animation Strategy

### Keyframe / Transition animations

- **Scale/opacity entrances** (Hero) → `@vueuse/motion` or Vue `<Transition>` with CSS `@keyframes`
- **AnimatePresence** → built-in `<Transition>`/`<TransitionGroup>` with `v-if`/`v-show`
- **Logo position animation** → CSS `transition: top 1.2s ease-out` toggled by prop

### Custom CSS property animation (popups)

The React popups animate a custom CSS property `--scale` via `motion/react`:

```typescript
// React pattern:
initial={{ '--scale': 0.8, 'opacity': 0 }}
animate={{ '--scale': 1, 'opacity': 1 }}
exit={{ '--scale': 0.8, 'opacity': 0 }}

// Applied via:
style={{ transform: 'translate(-50%, -50%) scale(var(--scale, 1))' }}
```

This avoids Framer Motion overriding the `translate(-50%, -50%)` centering transform. In Vue, use `<Transition>` with CSS classes that animate `--scale`:

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

The `transform: translate(-50%, -50%) scale(var(--scale, 1))` stays as an inline style on the element itself, never touched by the transition classes.

### Scroll-driven reactive styles (carousel blur)

The carousel blur effect is **not** a keyframe or transition — it's a reactive computed value driven by scroll position in real time:

```typescript
// Continuous binding, updated on every scroll frame:
style={{ backdropFilter: `blur(${8 * blurIntensity}px)` }}
```

In Vue, derive `blurIntensity` as a `computed()` from the `useScroll` reactive `x` value (see Phase 4), then bind it directly:

```vue
<div :style="{ backdropFilter: `blur(${8 * blurIntensity}px)` }" />
```

This category of animation (scroll-driven inline styles) requires no animation library — just reactive computation.

### Drag reorder (admin)

The React app uses `motion/react`'s `<Reorder.Group>` / `<Reorder.Item>` with `whileDrag={{ scale: 1.01, boxShadow: '...' }}` for project ordering in the admin dashboard.

Vue alternative: `useSortable` from `@vueuse/integrations`, which wraps SortableJS. Requires installing `@vueuse/integrations` and `sortablejs`:

```bash
npm install @vueuse/integrations sortablejs
```

Key differences from React's Reorder API:
- `useSortable` provides `animation: 200` option for smooth reorder transitions
- No built-in `whileDrag` style — add drag styles manually via SortableJS's `onStart`/`onEnd` callbacks or CSS classes (`.sortable-drag`, `.sortable-ghost`)
- Returns `start()`, `stop()`, and `option()` for runtime control

## Phase 6 — Admin Pages

### Route guard (improvement over React)

The React app checks `pb.authStore.isValid` on mount in `AdminDashboard.tsx` — no route-level protection. The Vue version should use `vue-router` navigation guards:

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

All admin pages lazy-loaded with `() => import()` (already configured in `vue/router/index.ts`).

### Component complexity notes

**`AdminLogin.vue`**

- React uses `isMountedRef` to prevent `setState` after unmount during async auth. In Vue 3, this is not needed if using `onUnmounted` + a cancellation flag, since Vue's reactivity system handles unmounted components more gracefully.
- Auth flow: `pb.collection('users').authWithPassword()` → on success navigate to `/admin/dashboard`.

**`AdminDashboard.vue`**

- **Drag-to-reorder projects**: Replace `<Reorder.Group>` with `useSortable`. On reorder, batch-update PocketBase with `Promise.all` using `requestKey: null` to prevent auto-cancellation of parallel requests:
  ```typescript
  const updates = newOrder.map((project, i) =>
    pb.collection('Portfolio_Projects').update(project.id, { Order: i + 1 }, { requestKey: null })
  )
  await Promise.all(updates)
  ```
- **Toast notifications**: Use the custom `useToast()` composable for CRUD feedback.
- **Project CRUD**: Create/delete operations via PocketBase SDK with FormData.

**`ProjectEditor.vue`**

The most complex admin component. Key challenges:

- **Image reordering**: PocketBase does not preserve array order on update. The React workaround is: (1) delete all existing images from the record, (2) download existing images as blobs, (3) re-upload all images (existing + new) in the desired order via FormData. This must be preserved exactly in Vue.
- **Form state management**: Tracks each image as `{ src: string, file?: File, isExisting: boolean }`. New uploads use `URL.createObjectURL(file)` for preview. Existing images use PocketBase file URLs.
- **File input handling**: Hidden `<input type="file">` triggered by button clicks via template refs (`heroFileInputRef`, `heroMobileFileInputRef`).
- **FormData construction**: Multiple `formData.append('Images', file)` calls for multi-image upload. Framework-agnostic but the state orchestration around it is complex.

**`SettingsSidebar.vue`**

- Form state for hero title, responsive font sizes, checkboxes, client list.
- Favicon upload with file input ref.
- Settings update via PocketBase SDK.

**`ProjectPopupPreview.vue`**

- Preview component using the same `--scale` custom CSS property animation pattern as the main `ProjectPopup.vue` (see Phase 5).
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

Every VueUse composable used in this migration, which package it comes from, and where it's used.

### `@vueuse/core`

| Composable | Purpose | Used in |
|---|---|---|
| `useBreakpoints` | Reactive viewport breakpoint tracking via `matchMedia`. Replaces manual `resize` listeners + `useState(isMobile)`. Tailwind preset available. | `Home.vue`, any component needing responsive logic |
| `useIntersectionObserver` | Wraps native IntersectionObserver with auto-cleanup. `threshold: 0.5` for section visibility. | `Home.vue` (section tracking) |
| `useScroll` | Reactive scroll position (`x`, `y`), `isScrolling`, `arrivedState`, `directions`. `x` is writable for programmatic scrolling. `throttle` option replaces debounced listeners. | `MotionCarousel.vue`, `MotionCarouselDesktop.vue` |
| `useEventListener` | Auto-cleaning event listener. Replaces manual `addEventListener`/`removeEventListener` pairs. | `Home.vue` (edge gesture prevention) |
| `useStorage` | Reactive localStorage with cross-tab sync, custom serializers, and TTL support. | `usePocketBase` composable (response caching) |
| `useLocalStorage` | Shorthand for `useStorage` with localStorage. | `useFaviconCache` composable (favicon base64 caching) |
| `useFavicon` | Reactively sets `<link rel="icon">` href. Returns writable ref. | `useFaviconCache` composable |
| `useBase64` | Converts Blob/File to base64 string. | `useFaviconCache` composable (favicon blob → data URL) |
| `useTimeoutFn` | Controllable timeout with `start()`/`stop()`/`isPending`. | `useToast` composable (auto-dismiss timers) |
| `tryOnScopeDispose` | Safe cleanup hook — works inside and outside component lifecycle. | `usePocketBase` composable (PocketBase subscription cleanup) |

### `@vueuse/integrations`

| Composable | Purpose | Used in |
|---|---|---|
| `useSortable` | Wraps SortableJS for drag-and-drop list reordering. `animation: 200` for smooth transitions. CSS classes `.sortable-drag`/`.sortable-ghost` for drag styles. | `AdminDashboard.vue` (project reorder) |

### `@vueuse/motion`

| Composable | Purpose | Used in |
|---|---|---|
| `useMotion` / `v-motion` directive | Declarative enter/leave animations (scale, opacity, position). Replaces `motion/react`'s `<motion.div>`. | `Hero.vue`, `HeroMobile.vue` |
