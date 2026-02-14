import type { AboutResponse } from '~/shared/types/pocketbase-types'

export default defineCachedEventHandler(async () => {
  console.warn(`[ISR] ${new Date().toISOString()} - FETCH: About data from PocketBase`)

  const url = `${useRuntimeConfig().pbUrl}/api/collections/About/records`
  const response = await $fetch<{ items: AboutResponse<string[]>[] }>(url)

  console.warn(`[ISR] ${new Date().toISOString()} - CACHED: About (${response.items?.length || 0} items)`)
  return response
}, {
  maxAge: 60 * 60 * 24 * 365,
  name: 'about',
  group: 'pocketbase',
  swr: true,
  getKey: () => 'data',
})
