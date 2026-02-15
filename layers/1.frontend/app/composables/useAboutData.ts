import type { PaginatedResponse } from '~/shared/types/api'
import type { AboutResponse } from '~/shared/types/pocketbase-types'
import { findActiveItem } from '~/shared/types/api'

export function useAboutData() {
  const { data: aboutRes } = useNuxtData<PaginatedResponse<AboutResponse<string[]>>>('about')

  const aboutData = computed(() => findActiveItem(aboutRes.value?.items))

  return { aboutData }
}
