# ISR Caching Architecture

This document explains the Incremental Static Regeneration (ISR) implementation and the separation between public-facing and admin data fetching approaches.

## Overview

The application uses two distinct data fetching strategies:

| Context | Approach | Data Source |
|---------|----------|-------------|
| **Frontend (index.vue)** | ISR via cached server endpoints | `/api/data/*` endpoints |
| **Admin Dashboard** | Direct SDK calls | PocketBase SDK |

This separation ensures:
- Fast page loads for visitors (cached data)
- Real-time data for content editors (no cache staleness)
- Manual cache invalidation when content is published

---

## Frontend: ISR Cached Endpoints

### Architecture

```
Visitor Request
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nuxt Server                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  /api/data/about.get.ts                              │    │
│  │  /api/data/homepage.get.ts                           │    │
│  │  /api/data/portfolio.get.ts                          │    │
│  │                                                       │    │
│  │  defineCachedEventHandler()                          │    │
│  │  - maxAge: 1 year (permanent until invalidated)      │    │
│  │  - group: 'pocketbase'                               │    │
│  │  - swr: true (stale-while-revalidate)                │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│              ┌─────────────────────┐                        │
│              │  Cache Storage       │                        │
│              │  .cache/nitro/cache/ │                        │
│              │  pocketbase/*.json   │                        │
│              └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │  PocketBase REST    │
              │  (cache miss only)  │
              └─────────────────────┘
```

### Cache Behavior

1. **First Request (Cache Miss)**
   - Handler executes, fetches from PocketBase
   - Response cached to `.cache/nitro/cache/pocketbase/`
   - `[ISR] FETCH: <collection> data from PocketBase` logged

2. **Subsequent Requests (Cache Hit)**
   - Cached response returned immediately
   - Handler does NOT execute
   - No log output (handler skipped entirely)

3. **After Invalidation**
   - Cache cleared via `/api/revalidate`
   - Next request triggers cache miss → fresh data fetched

### Implementation

**Cached Endpoint Example** (`server/api/data/portfolio.get.ts`):

```typescript
export default defineCachedEventHandler(async () => {
  console.warn(`[ISR] ${new Date().toISOString()} - FETCH: Portfolio data from PocketBase`)

  const url = `${useRuntimeConfig().pbUrl}/api/collections/Portfolio_Projects/records`
  const response = await $fetch<{ items: PortfolioProjectsResponse<string[]>[] }>(url)

  console.warn(`[ISR] ${new Date().toISOString()} - CACHED: Portfolio (${response.items?.length || 0} items)`)
  return response
}, {
  maxAge: 60 * 60 * 24 * 365,  // 1 year
  name: 'portfolio',
  group: 'pocketbase',
  swr: true,
  getKey: () => 'data',
})
```

**Frontend Usage** (`app/pages/index.vue`):

```typescript
// Preload all cached data on page load
await Promise.all([
  useFetch('/api/data/about', { key: 'about' }),
  useFetch('/api/data/homepage', { key: 'homepage' }),
  useFetch('/api/data/portfolio', { key: 'portfolio' }),
])

// Composables access the cached data
const { projects } = usePortfolioProjects()
```

---

## Admin Dashboard: Direct SDK Calls

### Architecture

```
Admin Dashboard
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  PocketBase SDK (Client-Side)                               │
│  - Auth state stored in localStorage                        │
│  - Automatic token refresh                                  │
│  - Real-time data (no cache)                                │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────┐
│  PocketBase Server  │
│  admin.kontext.site │
└─────────────────────┘
```

### Why Direct SDK?

| Requirement | SDK Approach | Server Proxy Approach |
|-------------|--------------|----------------------|
| Auth state persistence | localStorage (automatic) | Manual token passthrough |
| Token refresh | Automatic | Manual implementation |
| FormData uploads | Native support | Complex proxy handling |
| Real-time updates | Immediate | Cache staleness |
| Error handling | Structured errors | Additional translation layer |

### Implementation

**Admin Login** (`app/pages/admin.vue`):

```typescript
import { pb } from '~/utils/pocketbase'

async function handleLogin() {
  // SDK handles auth, stores token in localStorage
  await pb.collection('users').authWithPassword(email, password)
  navigateTo('/dashboard')
}
```

**CRUD Operations** (`app/pages/dashboard.vue`):

```typescript
import { pb } from '~/utils/pocketbase'

// Read - direct SDK call
const { data: projects } = useAsyncData('admin-projects', () =>
  pb.collection('Portfolio_Projects').getFullList({ sort: 'Order' })
)

// Create - direct SDK call with FormData
const formData = new FormData()
formData.append('Title', title)
formData.append('Images', imageFile)
await pb.collection('Portfolio_Projects').create(formData)

// Update - direct SDK call
await pb.collection('Portfolio_Projects').update(id, { Title: newTitle })

// Delete - direct SDK call
await pb.collection('Portfolio_Projects').delete(id)
```

---

## Cache Invalidation Flow

### The "Publish Changes" Button

When an admin finishes editing content, they click **"Publish Changes"** to make updates live:

```
Admin Dashboard
      │
      │ 1. Click "Publish Changes"
      ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/revalidate                                       │
│  Body: { collections: ['About', 'Homepage', 'Portfolio_Projects'] }
│  Headers: { Authorization: Bearer <token> }                 │
└─────────────────────────────────────────────────────────────┘
      │
      │ 2. Validate auth via getAuthenticatedPb()
      ▼
┌─────────────────────────────────────────────────────────────┐
│  server/utils/pocketbase.ts                                 │
│  - Extract token from header                                │
│  - Create PB instance                                       │
│  - Inject token for validation                              │
└─────────────────────────────────────────────────────────────┘
      │
      │ 3. Clear cache files
      ▼
┌─────────────────────────────────────────────────────────────┐
│  .cache/nitro/cache/pocketbase/                             │
│  - pocketbase:about:data.json      → DELETED                │
│  - pocketbase:homepage:data.json   → DELETED                │
│  - pocketbase:portfolio:data.json  → DELETED                │
└─────────────────────────────────────────────────────────────┘
      │
      │ 4. Next visitor request
      ▼
┌─────────────────────────────────────────────────────────────┐
│  Cache Miss → Fresh data fetched from PocketBase            │
│  New cache files created                                    │
│  Visitor sees updated content                               │
└─────────────────────────────────────────────────────────────┘
```

### Revalidate Implementation

**Endpoint** (`server/api/revalidate.post.ts`):

```typescript
export default defineEventHandler(async (event) => {
  // Validate admin auth
  getAuthenticatedPb(event)

  const body = await readBody(event)
  const collections = body?.collections || Object.keys(COLLECTION_CACHE_KEYS)

  const storage = useStorage('cache')
  
  for (const collection of collections) {
    const cacheKey = `pocketbase:${COLLECTION_CACHE_KEYS[collection]}:data.json`
    await storage.removeItem(cacheKey)
    console.warn(`[ISR] Invalidated cache: ${cacheKey}`)
  }

  return { success: true, invalidated: collections }
})
```

### Auth Utility

**Server Auth** (`server/utils/pocketbase.ts`):

```typescript
// Used only for revalidate endpoint
// Admin dashboard uses SDK directly (no server proxy needed)
export function getAuthenticatedPb(event: H3Event): PocketBase {
  const token = getHeader(event, 'authorization') || ''
  if (!token) {
    throw createError({ statusCode: 401, message: 'Authorization token is required' })
  }

  const pb = new PocketBase('https://admin.kontext.site')
  pb.authStore.save(token, null)  // Inject client's token

  return pb
}
```

---

## Server API Summary

### ISR Endpoints (Cached)

| Endpoint | Cache Key | Purpose |
|----------|-----------|---------|
| `GET /api/data/about` | `pocketbase:about:data.json` | About page content |
| `GET /api/data/homepage` | `pocketbase:homepage:data.json` | Hero image, title |
| `GET /api/data/portfolio` | `pocketbase:portfolio:data.json` | Project list |

### Admin Endpoints (Uncached)

| Endpoint | Purpose |
|----------|---------|
| `POST /api/revalidate` | Invalidate ISR cache |
| `GET /api/cache-debug` | Inspect cache state (debug) |
| `GET /api/font-sizes` | Custom font size storage |
| `PUT /api/font-sizes` | Update font sizes, regenerate CSS |
| `PUT /api/favicon` | Upload new favicon |

---

## Development vs Production

### Cache Locations

| Environment | Location |
|-------------|----------|
| Development | `.nuxt/cache/pocketbase/` |
| Production | `.cache/nitro/cache/pocketbase/` |

### Debugging

Check cache state:

```bash
# Development
ls .nuxt/cache/pocketbase/

# Production
ls .cache/nitro/cache/pocketbase/
```

Or use the debug endpoint (requires auth):

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/cache-debug
```

---

## Key Takeaways

1. **Frontend visitors** get blazing-fast responses from cache
2. **Admin users** get real-time data without cache interference
3. **Cache invalidation** is explicit and controlled via "Publish Changes"
4. **No token management complexity** - SDK handles auth on client, server only validates for cache ops
5. **Clean separation** of concerns between public and admin data flows
