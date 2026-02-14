export function usePortfolioProjects() {
  const { data: portfolioRes } = useNuxtData('portfolio')

  function getImageUrl(collectionId: string, recordId: string, filename: string) {
    return `https://admin.kontext.site/api/files/${collectionId}/${recordId}/${filename}`
  }

  const projects = computed(() => {
    const items = portfolioRes.value?.items ?? []
    return items
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.Order as number) - (b.Order as number))
      .map((project: Record<string, unknown>) => ({
        title: project.Title as string,
        description: project.Description as string,
        responsibility: project.Responsibility_json as string[],
        images: (project.Images as string[]).map(filename => ({
          src: getImageUrl(project.collectionId as string, project.id as string, filename),
        })),
      }))
  })

  return { projects }
}
