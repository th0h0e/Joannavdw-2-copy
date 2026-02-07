# Vue Migration Plan — Add Vue Version Alongside React

## Structure

```
/home/user/Joannavdw-2-copy/
├── src/                        # React app (untouched)
├── vue/                        # Vue app (new)
│   ├── App.vue
│   ├── main.ts
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
│   # Shared (used by both React and Vue)
├── src/config/pocketbase.ts    # Framework-agnostic
├── src/types/                  # Pure TypeScript
├── src/utils/sharedStyles.ts   # Plain strings
├── src/assets/                 # SVGs, images
├── public/                     # Fonts, manifest
├── tailwind.config.js          # Updated content paths
├── package.json                # Both React + Vue deps
```

## Phase 1 — Setup (no React changes)

1. **Add Vue dependencies** to existing `package.json` — `vue`, `vue-router`, `@vitejs/plugin-vue`, `@sentry/vue`, `eslint-plugin-vue`
2. **Create `vite.config.vue.ts`** — separate Vite config pointing at `vue/main.ts` and `index-vue.html`
3. **Create `index-vue.html`** — copy of `index.html` with mount point `<div id="app">` and entry `vue/main.ts`
4. **Add npm script** — `"dev:vue": "vite --config vite.config.vue.ts"` (and `build:vue`)
5. **Update `tailwind.config.js`** — add `./vue/**/*.{vue,ts}` to content paths
6. **Create `vue/main.ts`** — Vue app bootstrap, Sentry init, router setup
7. **Create `vue/router/index.ts`** — same 3 routes (`/`, `/admin`, `/admin/dashboard`)

## Phase 2 — Shared Code Imports

8. **Import directly from `src/`** — Vue components import `src/config/pocketbase.ts`, `src/types/*`, `src/utils/sharedStyles.ts`, and `src/assets/*` using path aliases
9. **Update Vite alias** in `vite.config.vue.ts` — `@` → `src/`, `@vue` → `vue/`
10. **CSS** — `vue/main.ts` imports `src/index.css` (same fonts, global styles, Tailwind)

## Phase 3 — Component Migration (Portfolio)

Vue components live in `vue/components/` and import shared code from `src/`:

| React (`src/components/`) | Vue (`vue/components/`) | Key Notes |
|---|---|---|
| `Hero.tsx` | `Hero.vue` | `motion` → CSS keyframes or `@vueuse/motion` |
| `HeroMobile.tsx` | `HeroMobile.vue` | Same animation approach |
| `MotionCarousel.tsx` | `MotionCarousel.vue` | Scroll-snap is pure CSS, scroll listeners via template refs |
| `MotionCarouselDesktop.tsx` | `MotionCarouselDesktop.vue` | Same + `@keydown` for arrow keys |
| `ProjectPopup.tsx` | `ProjectPopup.vue` | `AnimatePresence` → `<Transition>` |
| `AboutPopup.tsx` | `AboutPopup.vue` | Same `<Transition>` |
| `LogoTop.tsx` | `LogoTop.vue` | CSS `transition` on `top` property |
| `LogoBottom.tsx` | `LogoBottom.vue` | Same |
| `HamburgerMenu.tsx` | `HamburgerMenu.vue` | `createPortal` → `<Teleport to="body">` |
| `ProjectIndex.tsx` | `ProjectIndex.vue` | Straightforward |
| `ProjectNavigation.tsx` | `ProjectNavigation.vue` | `onClick` callback → `@click` emit |
| `ChevronDown.tsx` | `ChevronDown.vue` | `defineProps()` |
| `ChevronRight.tsx` | `ChevronRight.vue` | Same |
| `App.tsx` | `App.vue` | `useState` → `ref()`, `useEffect` → `onMounted()`/`watch()` |

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
3. Phase 3 — icons → simple components → carousels → popups → App.vue
4. Phases 4–5 happen alongside Phase 3
5. Phase 6 (admin)
6. Phase 7 (verify both apps)

## Key Dependency Changes

| Purpose | React | Vue |
|---|---|---|
| Framework | `react`, `react-dom` | `vue` |
| Routing | `react-router-dom` | `vue-router` |
| Vite plugin | `@vitejs/plugin-react` | `@vitejs/plugin-vue` |
| Animations | `motion` | `@vueuse/motion` (optional) or CSS transitions |
| Error tracking | `@sentry/react` | `@sentry/vue` |
| Linting | `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` | `eslint-plugin-vue` |
| Drag reorder | `motion` Reorder API | `vuedraggable` |
