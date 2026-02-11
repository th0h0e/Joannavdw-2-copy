import type { About, Homepage, PortfolioProject, Settings } from '~/plugins/pocketbase.client'
import { getImageUrl, pb } from '~/plugins/pocketbase.client'

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

export function usePocketBase() {
  const { data: rawProjects, refresh: refreshProjects, status: projectsStatus, error: projectsError } = useAsyncData(
    'projects',
    () => pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order' }),
  )

  const { data: rawHomepage, refresh: refreshHomepage, status: homepageStatus, error: homepageError } = useAsyncData(
    'homepage',
    () => pb.collection('Homepage').getFullList<Homepage>({ filter: 'Is_Active = true', sort: '-created' }),
  )

  const { data: rawAbout, refresh: refreshAbout, status: aboutStatus, error: aboutError } = useAsyncData(
    'about',
    () => pb.collection('About').getFullList<About>({ filter: 'Is_Active = true', sort: '-created' }),
  )

  const { data: rawSettings, refresh: refreshSettings, status: settingsStatus, error: settingsError } = useAsyncData(
    'settings',
    () => pb.collection('Settings').getFullList<Settings>({ sort: '-created' }),
  )

  const projects = computed(() => (rawProjects.value || []).map(convertPocketBaseProject))
  const homepage = computed(() => rawHomepage.value?.[0] || null)
  const about = computed(() => rawAbout.value?.[0] || null)
  const settings = computed(() => rawSettings.value?.[0] || null)

  const loading = computed(() =>
    projectsStatus.value === 'pending' || homepageStatus.value === 'pending'
    || aboutStatus.value === 'pending' || settingsStatus.value === 'pending',
  )

  const error = computed(() => {
    const err = projectsError.value || homepageError.value || aboutError.value || settingsError.value
    return err ? 'Failed to load data' : null
  })

  const setupSubscriptions = () => {
    pb.collection('Portfolio_Projects').subscribe('*', () => refreshProjects())
    pb.collection('Homepage').subscribe('*', () => refreshHomepage())
    pb.collection('About').subscribe('*', () => refreshAbout())
    pb.collection('Settings').subscribe('*', () => refreshSettings())
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
    setupSubscriptions,
    cleanup,
  }
}
