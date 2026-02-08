# PocketBase SDK + Nuxt Data Fetching Reference

## Why wrap with `useAsyncData`?

Nuxt's `useAsyncData` gives you SSR, caching, and hydration for free. The Nuxt docs recommend it specifically for third-party SDKs that provide their own query layer (like PocketBase).

**You get:** server-side rendering, automatic deduplication, reactive `data`/`status`/`error` refs, and `refresh()` to re-fetch on demand.

## Two approaches

You can call the PocketBase SDK in two places:

1. **Vue component / page** (`<script setup>`) — wrap read calls in `useAsyncData` for SSR + caching. Use the SDK directly for mutations and auth.
1. **Nitro server route** (`server/api/`) — create an API endpoint using `defineEventHandler`, then call it from the frontend with `useFetch`.

The server route approach keeps your PocketBase logic (and credentials) entirely server-side. The component approach is simpler but exposes the SDK to the client.

> **Note on h3:** Nitro server routes are powered by [h3](https://github.com/h3js/h3), a minimal HTTP framework. Functions like `defineEventHandler`, `readBody`, `getRouterParam`, `getQuery`, and `createError` all come from h3 — they are auto-imported by Nitro so you won't see an explicit `import` statement. h3 handles the HTTP layer (request/response), while PocketBase handles the database layer. They work together in server routes.

-----

## Read Operations

These benefit from SSR and caching. Both approaches shown.

### `getFullList`

**In a Vue component / page:**

```vue
<!-- app/pages/projects.vue -->
<script setup lang="ts">
const { data: projects, status, error, refresh } = await useAsyncData('projects', () =>
  pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order' }))
</script>

<template>
  <div v-for="project in projects" :key="project.id">
    {{ project.title }}
  </div>
</template>
```

**As a Nitro server route + component:**

```ts
// server/api/projects.get.ts
import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL)

export default defineEventHandler(async () => {            // ← h3: defines the route handler
  return await pb.collection('Portfolio_Projects').getFullList({ sort: 'Order' })  // ← PocketBase: fetches data
})
```

```vue
<!-- app/pages/projects.vue -->
<script setup lang="ts">
const { data: projects } = await useFetch('/api/projects')
</script>

<template>
  <div v-for="project in projects" :key="project.id">
    {{ project.title }}
  </div>
</template>
```

-----

### `getFirstListItem`

**In a Vue component / page:**

```vue
<!-- app/pages/featured.vue -->
<script setup lang="ts">
const { data: featured } = await useAsyncData('featured-project', () =>
  pb.collection('Portfolio_Projects').getFirstListItem('featured = true'))
</script>
```

**As a Nitro server route + component:**

```ts
// server/api/projects/featured.get.ts
export default defineEventHandler(async () => {            // ← h3
  return await pb.collection('Portfolio_Projects').getFirstListItem('featured = true')  // ← PocketBase
})
```

```vue
<script setup lang="ts">
const { data: featured } = await useFetch('/api/projects/featured')
</script>
```

-----

### `getOne`

**In a Vue component / page:**

```vue
<!-- app/pages/projects/[id].vue -->
<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: project } = await useAsyncData(`project-${id}`, () =>
  pb.collection('Portfolio_Projects').getOne<PortfolioProject>(id))
</script>
```

**As a Nitro server route + component:**

```ts
// server/api/projects/[id].get.ts
export default defineEventHandler(async (event) => {       // ← h3: defines handler, receives event
  const id = getRouterParam(event, 'id')                   // ← h3: extracts route param from URL
  return await pb.collection('Portfolio_Projects').getOne(id!)  // ← PocketBase: fetches single record
})
```

```vue
<!-- app/pages/projects/[id].vue -->
<script setup lang="ts">
const route = useRoute()

const { data: project } = await useFetch(`/api/projects/${route.params.id}`)
</script>
```

-----

### Typed example (with generics)

```ts
interface PortfolioProject {
  id: string
  title: string
  description: string
  Order: number
}

// In a component
const { data: projects } = await useAsyncData('projects', () =>
  pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order' })
)
```

-----

## Mutations

Mutations change data on the server. No SSR/caching benefit. Call `refresh()` after mutating to update any `useAsyncData` lists.

Both approaches shown — the server route approach is recommended for mutations as it keeps write operations server-side.

### `create`

**In a Vue component (SDK directly):**

```vue
<script setup lang="ts">
const { data: projects, refresh } = await useAsyncData('projects', () =>
  pb.collection('Portfolio_Projects').getFullList())

async function createProject(formData: Record<string, any>) {
  await pb.collection('Portfolio_Projects').create(formData)
  await refresh()
}
</script>
```

**As a Nitro server route + component:**

```ts
// server/api/projects.post.ts
export default defineEventHandler(async (event) => {       // ← h3: defines handler
  const body = await readBody(event)                       // ← h3: parses the POST request body
  return await pb.collection('Portfolio_Projects').create(body)  // ← PocketBase: creates record
})
```

```vue
<script setup lang="ts">
const { data: projects, refresh } = await useFetch('/api/projects')

async function createProject(formData: Record<string, any>) {
  await $fetch('/api/projects', { method: 'POST', body: formData })
  await refresh()
}
</script>
```

-----

### `update`

**In a Vue component (SDK directly):**

```vue
<script setup lang="ts">
async function updateProject(id: string, formData: Record<string, any>) {
  await pb.collection('Portfolio_Projects').update(id, formData)
  await refresh()
}
</script>
```

**As a Nitro server route + component:**

```ts
// server/api/projects/[id].put.ts
export default defineEventHandler(async (event) => {       // ← h3: defines handler
  const id = getRouterParam(event, 'id')                   // ← h3: extracts route param
  const body = await readBody(event)                       // ← h3: parses the PUT request body
  return await pb.collection('Portfolio_Projects').update(id!, body)  // ← PocketBase: updates record
})
```

```vue
<script setup lang="ts">
async function updateProject(id: string, formData: Record<string, any>) {
  await $fetch(`/api/projects/${id}`, { method: 'PUT', body: formData })
  await refresh()
}
</script>
```

-----

### `delete`

**In a Vue component (SDK directly):**

```vue
<script setup lang="ts">
async function deleteProject(id: string) {
  await pb.collection('Portfolio_Projects').delete(id)
  await refresh()
}
</script>
```

**As a Nitro server route + component:**

```ts
// server/api/projects/[id].delete.ts
export default defineEventHandler(async (event) => {       // ← h3: defines handler
  const id = getRouterParam(event, 'id')                   // ← h3: extracts route param
  return await pb.collection('Portfolio_Projects').delete(id!)  // ← PocketBase: deletes record
})
```

```vue
<script setup lang="ts">
async function deleteProject(id: string) {
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>
```

-----

## Auth

Auth is a client-side concern — the PocketBase SDK manages tokens in `authStore`. Use the SDK directly in components. A server route only makes sense if you want to keep credentials fully server-side (e.g. for admin-only auth).

### `authWithPassword`

**In a Vue component (typical approach):**

```vue
<script setup lang="ts">
async function login(email: string, password: string) {
  const authData = await pb.collection('users').authWithPassword(email, password)
  // pb.authStore is now populated with token + user record
}
</script>
```

### `authStore.isValid`

```ts
// Synchronous check — always use directly
const isLoggedIn = pb.authStore.isValid
const currentUser = pb.authStore.record
```

-----

## Realtime Subscriptions

Subscriptions use WebSockets and are **client-only**. Never wrap in `useAsyncData` or put in a server route.

### `subscribe`

```vue
<script setup lang="ts">
onMounted(() => {
  pb.collection('messages').subscribe('*', (e) => {
    console.log(e.action) // 'create' | 'update' | 'delete'
    console.log(e.record)
  })
})

onUnmounted(() => {
  pb.collection('messages').unsubscribe('*')
})
</script>
```

-----

## Utilities

### `files.getURL`

Synchronous helper — no SSR benefit. Use directly in components.

```vue
<script setup lang="ts">
const imageUrl = pb.files.getURL(record, record.avatar)
</script>

<template>
  <img :src="imageUrl">
</template>
```

### Native `fetch()`

For endpoints not covered by the PocketBase SDK, use Nuxt's `useFetch`:

```vue
<script setup lang="ts">
const { data } = await useFetch('https://some-external-api.com/endpoint')
</script>
```

-----

## Quick Reference Table

|Method              |`useAsyncData` in component?|Nitro server route?|Notes                            |
|--------------------|----------------------------|-------------------|---------------------------------|
|`getFullList()`     |Yes                         |Yes                |SSR + caching                    |
|`getFirstListItem()`|Yes                         |Yes                |SSR + caching                    |
|`getOne()`          |Yes                         |Yes                |SSR + caching                    |
|`create()`          |SDK directly                |Yes (recommended)  |Mutation — call `refresh()` after|
|`update()`          |SDK directly                |Yes (recommended)  |Mutation — call `refresh()` after|
|`delete()`          |SDK directly                |Yes (recommended)  |Mutation — call `refresh()` after|
|`authWithPassword()`|SDK directly                |Rarely             |Client-side auth                 |
|`authStore.isValid` |SDK directly                |No                 |Synchronous check                |
|`subscribe()`       |SDK directly                |No                 |Client-only WebSocket            |
|`files.getURL()`    |SDK directly                |No                 |Synchronous utility              |
|Native `fetch()`    |Use `useFetch`              |Use `$fetch`       |Nuxt's built-in alternative      |
