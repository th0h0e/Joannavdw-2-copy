import type { PaginatedResponse } from '~/shared/types/api'
import type { PortfolioProjectsResponse } from '~/shared/types/pocketbase-types'
import { getImageUrl } from '~/utils/pocketbase'

export function usePortfolioProjects() {
  const { data: portfolioRes } = useNuxtData<PaginatedResponse<PortfolioProjectsResponse<string[]>>>('portfolio')

  const projects = computed(() => {
    const items = portfolioRes.value?.items ?? []
    return items
      .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
      .map(project => ({
        title: project.Title ?? '',
        description: project.Description ?? '',
        responsibility: project.Responsibility_json ?? [],
        images: (project.Images ?? []).map((filename: string) => ({
          src: getImageUrl(project, filename),
        })),
      }))
  })

  const projectTitles = computed(() => projects.value.map(p => p.title))

  return { projects, projectTitles }
}
