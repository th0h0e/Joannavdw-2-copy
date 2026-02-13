// composables/useSectionTracking.ts
export function useSectionTracking(
  projectCount: Ref<number>,
  resetInactiveCarousels: (sectionId: string) => void,
) {
  const currentSectionIndex = ref(0)
  let observer: IntersectionObserver | null = null

  function setup() {
    if (observer)
      observer.disconnect()

    observer = new IntersectionObserver(
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
      { threshold: 0.5, root: document.querySelector('main') },
    )

    const heroSection = document.getElementById('hero-section')
    if (heroSection)
      observer.observe(heroSection)

    for (let i = 0; i < projectCount.value; i++) {
      const section = document.getElementById(`project-${i}`)
      if (section)
        observer.observe(section)
    }

    const indexSection = document.getElementById('project-index')
    if (indexSection)
      observer.observe(indexSection)
  }

  watch(projectCount, () => {
    nextTick(() => setup())
  })

  onUnmounted(() => {
    if (observer)
      observer.disconnect()
  })

  return { currentSectionIndex, setupSectionTracking: setup }
}
