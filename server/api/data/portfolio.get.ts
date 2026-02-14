import type { PortfolioProjectsResponse } from '~/shared/types/pocketbase-types'

export default defineCachedEventHandler(async () => {
  console.warn(`[ISR] ${new Date().toISOString()} - FETCH: Portfolio data from PocketBase`)

  const url = `${useRuntimeConfig().pbUrl}/api/collections/Portfolio_Projects/records`
  const response = await $fetch<{ items: PortfolioProjectsResponse<string[]>[] }>(url)

  console.warn(`[ISR] ${new Date().toISOString()} - CACHED: Portfolio (${response.items?.length || 0} items)`)
  return response
}, {
  maxAge: 60 * 60 * 24 * 365,
  name: 'portfolio',
  group: 'pocketbase',
  swr: true,
  getKey: () => 'data',
})
