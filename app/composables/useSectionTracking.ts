/**
 * =============================================================================
 * COMPOSABLE: useSectionTracking
 * =============================================================================
 *
 * Tracks which section of the page is currently visible in the viewport.
 *
 * This is used to:
 * - Determine if the user is on the "hero" section (for logo positioning)
 * - Trigger carousel resets when switching between projects
 * - Update UI elements based on current position
 *
 * Uses IntersectionObserver for efficient, performance-friendly tracking.
 *
 * @param projectCount - Ref containing total number of projects
 * @param resetInactiveCarousels - Callback to reset carousel scroll position
 *
 * @example
 * const { currentSectionIndex, setupSectionTracking } = useSectionTracking(
 *   projectCount,
 *   resetInactiveCarousels
 * )
 *
 * // currentSectionIndex values:
 * // 0 = hero section
 * // 1+ = project sections (project-0 is index 1)
 * // last = project index section
 */
export function useSectionTracking(
  projectCount: Ref<number>,
  resetInactiveCarousels: (sectionId: string) => void,
) {
  // Currently visible section index (0 = hero, 1+ = projects)
  const currentSectionIndex = ref(0)

  // IntersectionObserver instance for cleanup
  let observer: IntersectionObserver | null = null

  /**
   * Sets up IntersectionObserver to track section visibility
   *
   * Tracks:
   * - hero-section: index 0
   * - project-{n}: index n+1
   * - project-index: index projectCount + 1
   *
   * When a section becomes >50% visible:
   * - Updates currentSectionIndex
   * - Resets all other carousels to start position
   */
  function setup() {
    // Clean up previous observer if exists
    if (observer)
      observer.disconnect()

    // Create new observer
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only react when section is >50% visible
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.id
            let index: number | undefined

            // Map section ID to index
            if (sectionId === 'hero-section') {
              index = 0
            }
            else if (sectionId.startsWith('project-')) {
              // project-0 -> index 1, project-1 -> index 2, etc.
              index = Number.parseInt(sectionId.replace('project-', '')) + 1
            }
            else if (sectionId === 'project-index') {
              // Index section comes after all projects
              index = projectCount.value + 1
            }

            // Update state and trigger carousel reset
            if (index !== undefined) {
              currentSectionIndex.value = index
              resetInactiveCarousels(sectionId)
            }
          }
        })
      },
      // Trigger when 50% of section is visible, relative to main scroll container
      { threshold: 0.5, root: document.querySelector('main') },
    )

    // Observe hero section
    const heroSection = document.getElementById('hero-section')
    if (heroSection)
      observer.observe(heroSection)

    // Observe all project sections
    for (let i = 0; i < projectCount.value; i++) {
      const section = document.getElementById(`project-${i}`)
      if (section)
        observer.observe(section)
    }

    // Observe index section
    const indexSection = document.getElementById('project-index')
    if (indexSection)
      observer.observe(indexSection)
  }

  // Re-setup when project count changes (data loaded)
  watch(projectCount, () => {
    nextTick(() => setup())
  })

  // Clean up observer when component unmounts
  onUnmounted(() => {
    if (observer)
      observer.disconnect()
  })

  return { currentSectionIndex, setupSectionTracking: setup }
}
