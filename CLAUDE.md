# Joanna's Portfolio Website

## Overview
Portfolio website with vertical full-screen sections, each containing horizontal image carousels. Built with both React and Vue frontends sharing the same PocketBase backend.

## Project Structure

```
├── src/                        # React app (legacy)
├── vue/                        # Vue app (active, Nuxt-inspired structure)
│   ├── app.vue                 # Router shell
│   ├── main.ts                 # Entry point (Sentry init)
│   ├── assets/                 # CSS, SVGs, images
│   │   └── css/main.css        # Global styles (Tailwind, scroll-snap)
│   ├── components/             # Vue components
│   ├── composables/            # usePocketBase, useToast, useFaviconCache
│   ├── layouts/                # Layout components (placeholder)
│   ├── middleware/              # Route middleware (placeholder)
│   ├── pages/                  # Home.vue, admin/AdminLogin.vue, admin/AdminDashboard.vue
│   ├── plugins/                # pocketbase.ts (PB client, cache, helpers)
│   ├── router/                 # Vue Router config
│   ├── shared/types/           # TypeScript types (PocketBase, project)
│   └── utils/                  # Shared Tailwind class strings
├── vite.config.vue.ts          # Vue Vite config (@ alias → vue/)
├── tsconfig.vue.json           # Vue TypeScript config
└── public/                     # Fonts, manifest
```

## Key Architecture

- **Scroll**: Native CSS scroll-snap (vertical `y mandatory`, horizontal `x mandatory`) with anchor link navigation (`#project-0`, etc.)
- **Backend**: PocketBase at `https://admin.kontext.site` with real-time subscriptions and 7-day localStorage caching
- **Styling**: Tailwind CSS + EnduroWeb font (WOFF, `0.03em` letter-spacing)
- **Animations**: CSS transitions for popups (`--scale` custom property pattern to preserve `translate(-50%, -50%)` centering), CSS `transition` on logo positions
- **Popups**: State managed at App/Home level, rendered outside scroll containers with fixed positioning

## Key Components

| Component | Purpose |
|---|---|
| `Hero.vue` / `HeroMobile.vue` | Full-screen hero with scale-in animation |
| `MotionCarousel.vue` / `MotionCarouselDesktop.vue` | Horizontal scroll-snap image carousels with progress bar and blur slide |
| `ProjectPopup.vue` / `AboutPopup.vue` | Fixed-position modals with SVG card background |
| `LogoTop.vue` / `LogoBottom.vue` | Fixed logos with mix-blend-mode exclusion, animate between hero/section positions |
| `HamburgerMenu.vue` | Full-screen nav overlay (uses `<Teleport>`) |
| `ProjectIndex.vue` / `ProjectNavigation.vue` | Project list with anchor link navigation |
| `admin/ProjectEditor.vue` | Project CRUD with drag-reorder image upload |
| `admin/SettingsSidebar.vue` | Site settings (fonts, favicon, about content) |

## Development Commands
```bash
npm run dev        # Vue dev server (http://localhost:5174/)
npm run dev:react  # React dev server
```

## Important Patterns

- **Popup centering**: Use `transform: translate(-50%, -50%) scale(var(--scale, 1))` — animate `--scale` via CSS transitions, never override the translate
- **Popup state**: Keep at Home.vue level, not within sections
- **Image reordering (admin)**: PocketBase doesn't preserve array order — must delete all images then re-upload in desired order
- **PocketBase requests**: Use `requestKey: null` for batch `Promise.all` updates to prevent auto-cancellation

## Admin Dashboard Styling
- Zinc color scale, `rounded-sm`, glass morphism (`bg-black/80 backdrop-blur-xl`)
- Red accent for delete actions
- `motion/react` for React admin, CSS transitions for Vue admin
