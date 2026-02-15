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

  const { data: response } = useFetch<AboutResponse>(
    `${config.public.pbUrl}/api/collections/About/records`,
    {
      key: 'about',
      getCachedData(key) {
        const nuxtApp = useNuxtApp()
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      },
    },
  )

  const aboutData = computed(() => {
    return response.value?.items.find(item => item.Is_Active) ?? null
  })

  return { aboutData }
}
