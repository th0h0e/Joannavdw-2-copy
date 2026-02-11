Data Flow: PocketBase → User

  Public Site (Read-Only)

  PocketBase → usePocketBase.ts → index.vue → User sees content

  1. PocketBase (external service at https://admin.kontext.site) stores all data
  2. pocketbase.client.ts creates the SDK instance that talks to PocketBase
  3. usePocketBase.ts fetches data using useAsyncData (with caching) and sets up realtime WebSocket subscriptions
  4. index.vue calls usePocketBase() to get projects/homepage/about data
  5. Components (Hero.vue, MotionCarousel.vue, ProjectPopup.vue, etc.) receive data as props and render it

  Admin Dashboard (Read + Write)

  Reading Data

  PocketBase → pocketbase.client.ts → dashboard.vue → Admin sees data

  1. dashboard.vue uses useAsyncData directly with the pb SDK instance
  2. pb.collection().getFullList() or getFirstListItem() fetches from PocketBase
  3. Vue reactivity displays it in the admin UI

  Writing Data (The New Flow)

  Admin action → Client component → Nitro server route → PocketBase → Refresh → Admin sees update

  1. Admin clicks save in ProjectEditor.vue, dashboard.vue, or SettingsSidebar.vue
  2. Component calls $fetch('/api/projects') with Authorization: pb.authStore.token header
  3. Nitro server route (server/api/projects/index.post.ts, etc.) receives the request
  4. server/utils/pocketbase.ts creates an authenticated PocketBase instance using the token
  5. Server route forwards the request to PocketBase
  6. PocketBase saves the data and responds
  7. Component calls refresh() on its useAsyncData to re-fetch updated data
  8. Admin sees the changes immediately

  Key Files Summary
  ┌──────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │    Layer     │                                                                    Files                                                                     │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ External     │ PocketBase service (https://admin.kontext.site)                                                                                              │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Client SDK   │ pocketbase.client.ts                                                                                                                         │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Public reads │ usePocketBase.ts → index.vue → all public components                                                                                         │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Admin reads  │ dashboard.vue, SettingsSidebar.vue (direct pb usage)                                                                                         │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Admin writes │ Client components → Nitro routes (server/api/projects/*.ts, server/api/homepage/[id].put.ts, etc.) → server/utils/pocketbase.ts → PocketBase │
  ├──────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Auth         │ auth.ts middleware, admin/index.vue login page                                                                                               │
  └──────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

The main architectural change we made: writes no longer go directly from client to PocketBase — they route through Nitro server endpoints for better security.



  pocketbase.client.ts (plugin) = foundation
  - Creates the pb SDK instance
  - Exports helpers (getImageUrl, getResponsiveFontSizes)
  - Exports types (PortfolioProject, Homepage, etc.)
  - Used by everything — admin pages, composables, middleware

  usePocketBase.ts (composable) = public site data layer
  - Imports pb from the plugin (line 2)
  - Wraps read calls in useAsyncData for caching
  - Adds computed properties, loading/error states
  - Sets up realtime subscriptions
  - Only used by the public-facing pages

  The relationship:

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
