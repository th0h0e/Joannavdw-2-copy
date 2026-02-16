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

            const nudgeAmount = 60
            const duration = 800
            const startTime = performance.now()
            const startScroll = carousel.scrollLeft

            function animate(currentTime: number) {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)

              // Smooth sine wave: 0 -> peak -> 0
              const wave = Math.sin(progress * Math.PI)
              const offset = wave * nudgeAmount

              carousel.scrollLeft = startScroll + offset

              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }

            requestAnimationFrame(animate)
          }, 1000)
        }
      })
    },
    { threshold: 0.5, rootMargin: '0px' },
  )

  return { setup: () => {} }
}
