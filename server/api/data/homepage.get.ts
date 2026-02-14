import type { HomepageResponse } from '~/shared/types/pocketbase-types'

export default defineCachedEventHandler(async () => {
  const url = `${useRuntimeConfig().pbUrl}/api/collections/Homepage/records`
  const response = await $fetch<{ items: HomepageResponse[] }>(url)
  return response
}, {
  maxAge: 60 * 60 * 24 * 365,
  name: 'homepage',
  group: 'pocketbase',
  swr: true,
  getKey: () => 'data',
})
