import type { PortfolioProjectsResponse } from '~/shared/types/pocketbase-types'

export default defineCachedEventHandler(async () => {
  const url = `${useRuntimeConfig().pbUrl}/api/collections/Portfolio_Projects/records`
  const response = await $fetch<{ items: PortfolioProjectsResponse<string[]>[] }>(url)
  return response
}, {
  maxAge: 60 * 60 * 24 * 365,
  name: 'portfolio',
  group: 'pocketbase',
  swr: true,
  getKey: () => 'data',
})
