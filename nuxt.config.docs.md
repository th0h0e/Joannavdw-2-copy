# Data Flow Architecture: PocketBase Integration

## Overview

This document describes the data fetching patterns used in the application, which connects to PocketBase (https://admin.kontext.site) for all data storage and retrieval.

---

## Public Site (Read-Only)

### Data Flow
```
PocketBase → usePocketBase.ts → index.vue → User sees content
```

### How It Works

1. **PocketBase** stores all data (external service at https://admin.kontext.site)
2. **pocketbase.client.ts** creates the SDK instance for PocketBase communication
3. **usePocketBase.ts** fetches data using `useAsyncData` (with caching) and sets up realtime WebSocket subscriptions
4. **index.vue** calls `usePocketBase()` to get projects, homepage, and about data
5. **Components** (Hero.vue, MotionCarousel.vue, ProjectPopup.vue, etc.) receive data as props and render it

---

## Admin Dashboard (Read + Write)

### Reading Data

```
PocketBase → pocketbase.client.ts → dashboard.vue → Admin sees data
```

**How It Works:**

1. **dashboard.vue** uses `useAsyncData` directly with the pb SDK instance
2. **pb.collection().getFullList()** or **pb.collection().getFirstListItem()** fetches from PocketBase
3. **Vue reactivity** displays the data in the admin UI

### Writing Data (New Flow)

```
Admin action → Client component → Nitro server route → PocketBase → Refresh → Admin sees update
```

**How It Works:**

1. Admin clicks save in **ProjectEditor.vue**, **dashboard.vue**, or **SettingsSidebar.vue**
2. Component calls `$fetch('/api/projects')` with `Authorization: pb.authStore.token` header
3. **Nitro server route** (server/api/projects/index.post.ts, etc.) receives the request
4. **server/utils/pocketbase.ts** creates an authenticated PocketBase instance using the token
5. Server route forwards the request to PocketBase
6. PocketBase saves the data and responds
7. Component calls `refresh()` on its `useAsyncData` to re-fetch updated data
8. Admin sees the changes immediately

---

## Architecture Layers

| Layer | Files |
|-------|-------|
| **External Service** | PocketBase (https://admin.kontext.site) |
| **Client SDK** | pocketbase.client.ts |
| **Public Reads** | usePocketBase.ts → index.vue → all public components |
| **Admin Reads** | dashboard.vue, SettingsSidebar.vue (direct pb usage) |
| **Admin Writes** | Client components → Nitro routes (server/api/projects/*.ts, server/api/homepage/[id].put.ts, etc.) → server/utils/pocketbase.ts → PocketBase |
| **Authentication** | auth.ts middleware, admin/index.vue login page |

---

## Key Files & Responsibilities

### pocketbase.client.ts (Plugin) — Foundation

- Creates the pb SDK instance
- Exports helper functions (getImageUrl, getResponsiveFontSizes)
- Exports TypeScript types (PortfolioProject, Homepage, etc.)
- Used by everything — admin pages, composables, middleware

### usePocketBase.ts (Composable) — Public Site Data Layer

- Imports pb from the plugin (line 2)
- Wraps read calls in `useAsyncData` for caching
- Adds computed properties, loading/error states
- Sets up realtime subscriptions
- Only used by public-facing pages

### The Relationship

```
pocketbase.client.ts (plugin)
  └── provides `pb` instance + types + helpers
        │
        ├── usePocketBase.ts (composable)
        │     └── public site reads (useAsyncData + subscriptions)
        │
        ├── admin/dashboard.vue
        │     └── admin reads (useAsyncData) + writes ($fetch → server routes)
        │
        ├── SettingsSidebar.vue / ProjectEditor.vue
        │     └── admin reads + writes ($fetch → server routes)
        │
        └── auth.ts (middleware)
              └── pb.authStore.isValid check
```

---

## Key Architectural Decision

> **The main architectural change made:** Writes no longer go directly from client to PocketBase — they route through Nitro server endpoints for better security.
