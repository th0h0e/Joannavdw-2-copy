// composables/useEdgeGesturePrevention.ts
export function useEdgeGesturePrevention() {
  useEventListener(document, 'touchstart', (e: TouchEvent) => {
    const touch = e.touches[0]
    if (touch && touch.clientX < 50) {
      const carousel = (e.target as Element)?.closest('[data-carousel]')
      if (!carousel) {
        e.preventDefault()
      }
    }
  }, { passive: false })
}
