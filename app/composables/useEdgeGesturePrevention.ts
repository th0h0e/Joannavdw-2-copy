// Prevents iOS Safari edge swipe gestures from interfering with carousel navigation.
// Only active on iOS/Safari where this gesture behavior exists.
export function useEdgeGesturePrevention() {
  if (import.meta.server)
    return

  const { isIos, isSafari } = useDevice()

  // Only needed on iOS/Safari browsers
  if (!isIos && !isSafari)
    return

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
