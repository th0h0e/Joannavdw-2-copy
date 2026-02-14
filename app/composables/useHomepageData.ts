import type { HomepageResponse } from '~/shared/types/pocketbase-types'

interface HomepageListResponse {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: HomepageResponse[]
}

export function useHomepageData() {
  const { data: homepageRes } = useNuxtData<HomepageListResponse>('homepage')

  const homepage = computed(() => homepageRes.value?.items?.find(i => i.Is_Active) ?? null)

  const heroImage = computed(() => {
    if (!homepage.value)
      return ''
    return `https://admin.kontext.site/api/files/${homepage.value.collectionId}/${homepage.value.id}/${homepage.value.Hero_Image}`
  })

  const heroTitle = computed(() => homepage.value?.Hero_Title || 'Creative Strategy and Communication')

  return { heroImage, heroTitle }
}
