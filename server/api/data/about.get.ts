import type { AboutResponse } from '~/shared/types/pocketbase-types'

export default defineCachedEventHandler(async () => {
  const url = `${useRuntimeConfig().pbUrl}/api/collections/About/records`
  const response = await $fetch<{ items: AboutResponse<string[]>[] }>(url)
  return response
}, {
  maxAge: 60 * 60 * 24 * 365,
  name: 'about',
  group: 'pocketbase',
  swr: true,
  getKey: () => 'data',
})
