# Rendering & Data Strategy

This document explains the hybrid rendering approach and data fetching strategy for the portfolio.

## Overview

The application uses **hybrid rendering** with different strategies per route:

| Route | Rendering | Data Strategy |
|-------|-----------|---------------|
| `/` (Homepage) | SSR + Prerender | Data baked in at build, refreshed on mount |
| `/admin/**` | CSR | Direct PocketBase SDK |
| `/dashboard` | CSR | Direct PocketBase SDK |

## Frontend: Prerender with Background Refresh

### Architecture

```
Build Time (nuxt generate)
      │
      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Server renders homepage                                        │
│  - useFetch calls PocketBase during build                       │
│  - HTML + _payload.json created with data                       │
└─────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Visitor loads page                                             │
│  - Instant display of prerendered HTML                          │
│  - Vue hydrates with payload data                               │
│  - onMounted triggers refresh() for fresh data                  │
│  - Page updates if data changed                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },      // Homepage: prerender at build time
    '/admin/**': { ssr: false },   // Admin layer: client-side only
    '/dashboard': { ssr: false },  // Dashboard: client-side only
  },
})
```

### Data Refresh Strategy

Each data composable refreshes on mount to ensure fresh data:

```ts
// app/composables/usePortfolioProjects.ts
export function usePortfolioProjects() {
  const { data, refresh } = useFetch(...)
  
  // Refresh data after hydration for freshness
  onMounted(() => {
    refresh()
  })
  
  return { projects, refresh }
}
```

This gives visitors:
1. **Instant initial load** - prerendered content displays immediately
2. **Fresh content** - background refresh updates if PocketBase changed
3. **No cache invalidation needed** - each visitor fetches fresh data

## Admin Dashboard: Direct SDK Calls

Admin pages use client-side rendering with direct PocketBase SDK calls:

- Real-time data for content editors
- No cache staleness concerns
- FormData support for image uploads
- Automatic token management

## SSR Safety

All client-only code (window, document) is guarded with `import.meta.server` checks:

```ts
function handleLinkClick(index: number) {
  if (import.meta.server) return
  window.location.hash = `#project-${index}`
}
```

## Publishing Changes

When an admin publishes changes:

1. Updates are written directly to PocketBase
2. Next visitor to the homepage:
   - Gets prerendered HTML instantly (may have stale data)
   - Vue hydrates
   - `onMounted` refresh fetches fresh data
   - Page updates with new content

This "stale-first, refresh-after" approach provides:
- Fast initial page loads
- Fresh content within seconds
- No server cache infrastructure to manage
