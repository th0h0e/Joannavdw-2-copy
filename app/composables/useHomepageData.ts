interface HomepageItem {
  id: string
  collectionId: string
  Hero_Image: string
  Hero_Image_Mobile: string
  Hero_Title: string
  Is_Active: boolean
}

interface HomepageResponse {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: HomepageItem[]
}

export function useHomepageData() {
  const config = useRuntimeConfig()

  const { data: response, status, error, refresh } = useFetch<HomepageResponse>(
    `${config.public.pbUrl}/api/collections/Homepage/records`,
    {
      key: 'homepage',
      getCachedData: () => undefined,
    },
  )

  const loading = computed(() => status.value === 'pending')
  const hasError = computed(() => !!error.value)

  const homepage = computed(() => {
    return response.value?.items.find(item => item.Is_Active) ?? null
  })

  const heroImage = computed(() => {
    if (!homepage.value?.Hero_Image)
      return ''
    return getImageUrl(homepage.value, homepage.value.Hero_Image)
  })

  const heroTitle = computed(() => homepage.value?.Hero_Title || 'Creative Strategy and Communication')

  return { heroImage, heroTitle, loading, hasError, error, refresh }
}
