import type { HomepageResponse } from '~/shared/types/pocketbase-types'

export default defineCachedEventHandler(async () => {
  console.warn(`[ISR] ${new Date().toISOString()} - FETCH: Homepage data from PocketBase`)

  const url = `${useRuntimeConfig().pbUrl}/api/collections/Homepage/records`
  const response = await $fetch<{ items: HomepageResponse[] }>(url)

  console.warn(`[ISR] ${new Date().toISOString()} - CACHED: Homepage (${response.items?.length || 0} items)`)
  return response
}, {
  maxAge: 60 * 60 * 24 * 365,
  name: 'homepage',
  group: 'pocketbase',
  swr: true,
  getKey: () => 'data',
})
