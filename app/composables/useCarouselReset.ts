/**
 * =============================================================================
 * COMPOSABLE: useCarouselReset
 * =============================================================================
 *
 * Resets all carousels to their starting position (scrollLeft = 0)
 * when the user navigates to a different project section.
 *
 * This ensures that when a user returns to a previously viewed project,
 * the carousel starts at the first slide rather than where they left off.
 *
 * @param projectCount - Ref containing total number of projects
 *
 * @example
 * const { resetInactiveCarousels } = useCarouselReset(projectCount)
 *
 * // Call when user scrolls to a new section
 * resetInactiveCarousels('project-0')
 */
export function useCarouselReset(projectCount: Ref<number>) {
  /**
   * Reset all carousels except the current one to scroll position 0
   *
   * @param currentSectionId - The ID of the currently visible section (e.g., 'project-0')
   *
   * Implementation notes:
   * - Uses setTimeout(300ms) to allow scroll to complete before resetting
   * - Searches for carousel elements by class name within each section
   * - Skips the current section (no need to reset the one user is viewing)
   */
  function resetInactiveCarousels(currentSectionId: string) {
    // Delay reset to allow scroll animation to complete
    setTimeout(() => {
      // Iterate through all project sections
      for (let index = 0; index < projectCount.value; index++) {
        const sectionId = `project-${index}`

        // Skip the current section - don't reset where user is looking
        if (sectionId === currentSectionId)
          continue

        // Find the section element
        const section = document.getElementById(sectionId)
        if (!section)
          continue

        // Find carousel within this section (works for both mobile and desktop)
        const carousel = section.querySelector('.motion-carousel, .motion-carousel-desktop') as HTMLElement
        if (!carousel)
          continue

        // Reset scroll position to start
        carousel.scrollLeft = 0
      }
    }, 300)
  }

  return { resetInactiveCarousels }
}
