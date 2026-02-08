import type { About, Homepage, PortfolioProject, Settings } from '~/plugins/pocketbase.client'
import { pb, getCachedData, getImageUrl, setCachedData } from '~/plugins/pocketbase.client'

export interface ConvertedProject {
  title: string
  description: string
  images: { src: string }[]
  responsibility?: string[]
}

function convertPocketBaseProject(project: PortfolioProject): ConvertedProject {
  return {
    title: project.Title,
    description: project.Description,
    images: project.Images.map(filename => ({
      src: getImageUrl(project, filename),
    })),
    responsibility: project.Responsibility_json || project.Responsibility,
  }
}

// eslint-disable-next-line react/no-unnecessary-use-prefix
export function usePocketBase() {
  const projects = ref<ConvertedProject[]>([])
  const homepage = ref<Homepage | null>(null)
  const about = ref<About | null>(null)
  const settings = ref<Settings | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchData = async () => {
    try {
      loading.value = true

      const cachedProjects = getCachedData<PortfolioProject[]>('Portfolio_Projects')
      const cachedHomepage = getCachedData<Homepage[]>('Homepage')
      const cachedAbout = getCachedData<About[]>('About')
      const cachedSettings = getCachedData<Settings[]>('Settings')

      if (cachedProjects && cachedHomepage && cachedAbout && cachedSettings) {
        projects.value = cachedProjects.map(convertPocketBaseProject)
        homepage.value = cachedHomepage[0] || null
        about.value = cachedAbout[0] || null
        settings.value = cachedSettings[0] || null
        error.value = null
        loading.value = false
        return
      }

      const [projectsResponse, homepageResponse, aboutResponse, settingsResponse] = await Promise.all([
        pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order' }),
        pb.collection('Homepage').getFullList<Homepage>({ filter: 'Is_Active = true', sort: '-created' }),
        pb.collection('About').getFullList<About>({ filter: 'Is_Active = true', sort: '-created' }),
        pb.collection('Settings').getFullList<Settings>({ sort: '-created' }),
      ])

      setCachedData('Portfolio_Projects', projectsResponse)
      setCachedData('Homepage', homepageResponse)
      setCachedData('About', aboutResponse)
      setCachedData('Settings', settingsResponse)

      projects.value = projectsResponse.map(convertPocketBaseProject)
      homepage.value = homepageResponse[0] || null
      about.value = aboutResponse[0] || null
      settings.value = settingsResponse[0] || null
      error.value = null
    }
    catch (err) {
      console.error('Error fetching data:', err)
      error.value = 'Failed to load data'
    }
    finally {
      loading.value = false
    }
  }

  const setupSubscriptions = () => {
    pb.collection('Portfolio_Projects').subscribe('*', async () => {
      const fresh = await pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order' })
      setCachedData('Portfolio_Projects', fresh)
      projects.value = fresh.map(convertPocketBaseProject)
    })

    pb.collection('Homepage').subscribe('*', async () => {
      const fresh = await pb.collection('Homepage').getFullList<Homepage>({ filter: 'Is_Active = true', sort: '-created' })
      setCachedData('Homepage', fresh)
      homepage.value = fresh[0] || null
    })

    pb.collection('About').subscribe('*', async () => {
      const fresh = await pb.collection('About').getFullList<About>({ filter: 'Is_Active = true', sort: '-created' })
      setCachedData('About', fresh)
      about.value = fresh[0] || null
    })

    pb.collection('Settings').subscribe('*', async () => {
      const fresh = await pb.collection('Settings').getFullList<Settings>({ sort: '-created' })
      setCachedData('Settings', fresh)
      settings.value = fresh[0] || null
    })
  }

  const cleanup = () => {
    pb.collection('Portfolio_Projects').unsubscribe()
    pb.collection('Homepage').unsubscribe()
    pb.collection('About').unsubscribe()
    pb.collection('Settings').unsubscribe()
  }

  onUnmounted(cleanup)

  return {
    projects,
    homepage,
    about,
    settings,
    loading,
    error,
    fetchData,
    setupSubscriptions,
    cleanup,
  }
}
