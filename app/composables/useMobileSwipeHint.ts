import { useIntersectionObserver } from '@vueuse/core'

export function useMobileSwipeHint(projectCount: Ref<number>) {
  const { isMobile: _isMobile } = useDevice()
  const hasShownMobileHint = ref(false)

  const target = computed(() => {
    if (import.meta.server)
      return null
    if (projectCount.value === 0)
      return null
    return document.getElementById('project-0')
  })

  const { stop } = useIntersectionObserver(
    target,
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasShownMobileHint.value) {
          hasShownMobileHint.value = true
          stop()

          setTimeout(() => {
            if (import.meta.server)
              return

            const firstProjectSection = document.getElementById('project-0')
            const carousel = firstProjectSection?.querySelector('.motion-carousel') as HTMLDivElement
            if (!carousel)
              return

            const nudgeAmount = 80

            carousel.scrollBy({ left: nudgeAmount, behavior: 'smooth' })

            setTimeout(() => {
              carousel.scrollBy({ left: -nudgeAmount, behavior: 'smooth' })
            }, 250)
          }, 1000)
        }
      })
    },
    { threshold: 0.5, rootMargin: '0px' },
  )

  return { setup: () => {} }
}
