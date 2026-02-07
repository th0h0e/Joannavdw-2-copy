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
│   │   ├── useResponsive.ts
│   │   ├── usePocketBase.ts
│   │   └── useSectionTracking.ts
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

Vue components import shared code from `src/` via the `@` alias. Verified PocketBase config, types, utils, and assets all resolve. Scoped React Vite config to avoid scanning Vue files.

DONE

## Phase 3 — Decouple & Component Migration

### Phase 3.0 — Install Vue packages

```bash
npm install @vueuse/motion @vueuse/core vuedraggable@next
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

### Phase 3.3 — Edge Gesture Prevention

Vue equivalent of React's `preventEdgeNavigation` — blocks browser back-swipe on iOS/Safari when touching near the left screen edge.

In `Home.vue`, register a document-level `touchstart` listener in `onMounted`:

```typescript
onMounted(() => {
  const preventEdgeNavigation = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (touch && touch.clientX < 50) {
      const carousel = (e.target as Element)?.closest('[data-carousel]')
      if (!carousel) {
        e.preventDefault()
      }
    }
  }
  document.addEventListener('touchstart', preventEdgeNavigation, { passive: false })
  onUnmounted(() => {
    document.removeEventListener('touchstart', preventEdgeNavigation)
  })
})
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

11. **`useResponsive()`** — `ref(isMobile)` + `resize` listener in `onMounted`/`onUnmounted`
12. **`usePocketBase()`** — data fetching, caching, real-time subscriptions, returns reactive refs
13. **`useSectionTracking()`** — IntersectionObserver, returns `currentSectionIndex` ref

## Phase 5 — Animation Strategy

- **Scale/opacity entrances** (Hero, popups) → Vue `<Transition>` with CSS `@keyframes`
- **AnimatePresence** → built-in `<Transition>`/`<TransitionGroup>`
- **Logo position animation** → CSS `transition: top 1.2s ease-out` toggled by prop
- **Drag reorder** (admin) → `vuedraggable` package

## Phase 6 — Admin Pages

14. `AdminLogin.vue`, `AdminDashboard.vue`, `ProjectEditor.vue`, `SettingsSidebar.vue`, `ProjectPopupPreview.vue`
15. Lazy-load admin routes with `() => import()`

## Phase 7 — Polish

16. Verify both `npm run dev` (React) and `npm run dev:vue` (Vue) work independently
17. Test scroll-snap, PocketBase subscriptions, responsive breakpoints
18. Ensure shared assets/types work for both apps

## Execution Order

1. Phase 1 (scaffolding) — blank Vue app running alongside React
2. Phase 2 (shared imports) — confirm Vue can use `src/` code
3. Phase 3.0 — install `@vueuse/motion`, `@vueuse/core`, `vuedraggable@next`
4. Phase 3.1 — decouple: duplicate config/types/utils/assets into `vue/`, update Vite alias
5. Phase 3.2–3.4 — icons → Home.vue skeleton → logos → hero → carousels → popups → full wiring
6. Phases 4–5 happen alongside Phase 3.2–3.4
7. Phase 6 (admin)
8. Phase 7 (verify both apps)

## Key Dependency Changes

| Purpose | React | Vue |
|---|---|---|
| Framework | `react`, `react-dom` | `vue` |
| Routing | `react-router-dom` | `vue-router` |
| Vite plugin | `@vitejs/plugin-react` | `@vitejs/plugin-vue` |
| Animations | `motion` | `@vueuse/motion` + `@vueuse/core` |
| Error tracking | `@sentry/react` | `@sentry/vue` |
| Linting | `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` | `eslint-plugin-vue` |
| Drag reorder | `motion` Reorder API | `vuedraggable` |
