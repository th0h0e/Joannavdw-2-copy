interface AboutItem {
  id: string
  About_Description: string
  Client_List_Json: { name: string }[]
  Contact_Email: string
  Contact_Message: string
  Expertise_Description: string
  Expertise_Title: string
  Is_Active: boolean
  Portfolio_Title: string
  Selected_Clients_Title: string
}

interface AboutResponse {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: AboutItem[]
}

export function useAboutData() {
  const config = useRuntimeConfig()

  const { data: response, status, error, refresh } = useFetch<AboutResponse>(
    `${config.public.pbUrl}/api/collections/About/records`,
    {
      key: 'about',
    },
  )

  const loading = computed(() => status.value === 'pending')
  const hasError = computed(() => !!error.value)

  const aboutData = computed(() => {
    return response.value?.items.find(item => item.Is_Active) ?? null
  })

  onMounted(() => {
    refresh()
  })

  return { aboutData, loading, hasError, error, refresh }
}
