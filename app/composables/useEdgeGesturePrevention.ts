/**
 * =============================================================================
 * COMPOSABLE: useEdgeGesturePrevention
 * =============================================================================
 *
 * Prevents edge swipe gestures on mobile devices from interfering with
 * the carousel navigation.
 *
 * On mobile browsers (especially iOS Safari), swiping from the left edge
 * triggers navigation gestures (like back button in iOS). This can interfere
 * with the horizontal carousel scrolling.
 *
 * This composable prevents that gesture ONLY when the user is NOT inside
 * a carousel element.
 *
 * @example
 * useEdgeGesturePrevention()
 * // Called once in index.vue to set up global listener
 */
export function useEdgeGesturePrevention() {
  /**
   * Touch event handler that prevents edge gestures
   *
   * Logic:
   * - Only triggers on touches starting within 50px of left edge
   * - Checks if touch originated inside a carousel element
   * - If NOT in carousel: prevents default (blocks edge swipe)
   * - If IN carousel: allows default behavior (carousel scrolling)
   *
   * @param e - TouchEvent from touchstart
   */
  useEventListener(document, 'touchstart', (e: TouchEvent) => {
    const touch = e.touches[0]
    if (touch && touch.clientX < 50) {
      // Check if the touch started inside a carousel
      const carousel = (e.target as Element)?.closest('[data-carousel]')

      // Only prevent default if NOT in a carousel
      // This allows edge swipe to work inside carousels but blocks it elsewhere
      if (!carousel) {
        e.preventDefault()
      }
    }
  }, { passive: false })
}
