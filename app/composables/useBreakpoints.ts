/**
 * SSR-compatible breakpoint detection using VueUse media queries.
 *
 * SSR Width: 768px (assumes tablet/desktop during SSR)
 *
 * Breakpoints:
 * - isMobile: < 768px
 * - isTabletOrAbove: >= 768px
 * - isDesktop: >= 1024px
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 767px)', { ssrWidth: 768 })
  const isDesktop = useMediaQuery('(min-width: 1024px)', { ssrWidth: 768 })
  const isTabletOrAbove = useMediaQuery('(min-width: 768px)', { ssrWidth: 768 })

  return {
    isMobile,
    isDesktop,
    isTabletOrAbove,
  }
}
