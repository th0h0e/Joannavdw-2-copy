import { useIntersectionObserver } from '@vueuse/core'

export function useSectionTracking(
  projectCount: Ref<number>,
  resetInactiveCarousels: (sectionId: string) => void,
) {
  const currentSectionIndex = ref(0)

  const targets = computed(() => {
    const elements: HTMLElement[] = []
    const heroSection = document.getElementById('hero-section')
    if (heroSection)
      elements.push(heroSection)

    for (let i = 0; i < projectCount.value; i++) {
      const section = document.getElementById(`project-${i}`)
      if (section)
        elements.push(section)
    }

    const indexSection = document.getElementById('project-index')
    if (indexSection)
      elements.push(indexSection)

    return elements
  })

  const { stop } = useIntersectionObserver(
    targets,
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id
          let index: number | undefined

          if (sectionId === 'hero-section') {
            index = 0
          }
          else if (sectionId.startsWith('project-')) {
            index = Number.parseInt(sectionId.replace('project-', '')) + 1
          }
          else if (sectionId === 'project-index') {
            index = projectCount.value + 1
          }

          if (index !== undefined) {
            currentSectionIndex.value = index
            resetInactiveCarousels(sectionId)
          }
        }
      })
    },
    { threshold: 0.5, root: computed(() => document.querySelector('main')) },
  )

  return { currentSectionIndex, setupSectionTracking: () => {}, stop }
}
