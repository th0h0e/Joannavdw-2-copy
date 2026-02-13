/**
 * =============================================================================
 * COMPOSABLE: useMobileSwipeHint
 * =============================================================================
 *
 * Shows a hint to mobile users about how to swipe through carousel images.
 *
 * On first visit, when the first project section becomes visible:
 * 1. Automatically scrolls to show the second slide (indicating horizontal scroll)
 * 2. Then scrolls back to the first slide
 * 3. This creates a visual "demo" of how to swipe
 *
 * Only runs once per session (tracked by hasShownMobileHint).
 *
 * @param isDesktop - Ref indicating if user is on desktop (hint only shows on mobile)
 * @param projectCount - Ref containing total number of projects
 *
 * @example
 * useMobileSwipeHint(isDesktop, projectCount)
 */
export function useMobileSwipeHint(isDesktop: boolean | Ref<boolean>, projectCount: Ref<number>) {
  // Track if hint has been shown to prevent repeated demonstrations
  const hasShownMobileHint = ref(false)

  /**
   * Main setup function that:
   * - Checks if hint should show (mobile, not shown yet, has projects)
   * - Sets up IntersectionObserver to detect when to show hint
   * - Executes the hint animation sequence
   */
  function setup() {
    // Skip if: desktop, already shown, or no projects
    if (toValue(isDesktop) || hasShownMobileHint.value || projectCount.value === 0)
      return

    // Watch for first project section entering viewport
    const hintObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When first project becomes visible, show the hint
          if (entry.isIntersecting && !hasShownMobileHint.value) {
            hasShownMobileHint.value = true
            hintObserver.disconnect()

            // Wait 1 second after appearing, then animate
            setTimeout(() => {
              // Get the carousel element
              const firstProjectSection = document.getElementById('project-0')
              const carousel = firstProjectSection?.querySelector('.motion-carousel') as HTMLDivElement
              if (!carousel)
                return

              const slides = carousel.querySelectorAll('.motion-carousel__slide')
              if (slides.length < 2)
                return

              const firstSlide = slides[0] as HTMLElement
              const secondSlide = slides[1] as HTMLElement

              // Scroll to second slide (shows there's more content)
              secondSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

              // Then scroll back to first slide after a short delay
              setTimeout(() => {
                setTimeout(() => {
                  firstSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                }, 300)
              }, 200)
            }, 1000)
          }
        })
      },
      // Trigger when 50% of the section is visible
      { threshold: 0.5, rootMargin: '0px' },
    )

    // Start observing the first project section
    const firstProjectSection = document.getElementById('project-0')
    if (firstProjectSection)
      hintObserver.observe(firstProjectSection)
  }

  // Re-run setup when project count changes (e.g., data loaded)
  watch(projectCount, () => {
    nextTick(() => setup())
  })

  return { setup }
}
