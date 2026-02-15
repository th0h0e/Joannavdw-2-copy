import type { ProjectImage } from '~/shared/types/project'

interface PortfolioItem {
  id: string
  collectionId: string
  Title: string
  Description: string
  Order: number
  Images: string[]
  Responsibility_json: string[]
}

interface PortfolioResponse {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: PortfolioItem[]
}

export function usePortfolioProjects() {
  const config = useRuntimeConfig()

  const { data: response } = useFetch<PortfolioResponse>(
    `${config.public.pbUrl}/api/collections/Portfolio_Projects/records`,
    {
      key: 'portfolio',
    },
  )

  const projects = computed(() => {
    if (!response.value)
      return []

    const sorted = [...response.value.items].sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))

    return sorted.map(project => ({
      title: project.Title ?? '',
      description: project.Description ?? '',
      responsibility: project.Responsibility_json ?? [],
      images: (project.Images ?? []).map((filename: string): ProjectImage => ({
        src: getImageUrl(project, filename),
      })),
    }))
  })

  const projectTitles = computed(() => projects.value.map(p => p.title))

  return { projects, projectTitles }
}
