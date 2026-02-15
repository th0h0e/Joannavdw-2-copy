import type { PaginatedResponse } from '~/shared/types/api'
import type { HomepageResponse } from '~/shared/types/pocketbase-types'
import { findActiveItem } from '~/shared/types/api'
import { getImageUrl } from '~/utils/pocketbase'

export function useHomepageData() {
  const { data: homepageRes } = useNuxtData<PaginatedResponse<HomepageResponse>>('homepage')

  const homepage = computed(() => findActiveItem(homepageRes.value?.items))

  const heroImage = computed(() => {
    if (!homepage.value)
      return ''
    return getImageUrl(homepage.value, homepage.value.Hero_Image)
  })

  const heroTitle = computed(() => homepage.value?.Hero_Title || 'Creative Strategy and Communication')

  return { heroImage,
    heroTitle }
}
