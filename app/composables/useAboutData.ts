import type { AboutResponse } from '~/shared/types/pocketbase-types'

interface AboutListResponse {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: AboutResponse<string[]>[]
}

export function useAboutData() {
  const { data: aboutRes } = useNuxtData<AboutListResponse>('about')

  const aboutData = computed(() => aboutRes.value?.items?.find(i => i.Is_Active) ?? null)

  return { aboutData }
}
