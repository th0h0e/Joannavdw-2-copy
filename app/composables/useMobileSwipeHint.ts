import { useIntersectionObserver } from '@vueuse/core'

export function useMobileSwipeHint(projectCount: Ref<number>) {
  const { isMobile: _isMobile } = useDevice()
  const hasShownMobileHint = ref(false)

  const target = computed(() => {
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
            const firstProjectSection = document.getElementById('project-0')
            const carousel = firstProjectSection?.querySelector('.motion-carousel') as HTMLDivElement
            if (!carousel)
              return

            const slides = carousel.querySelectorAll('.motion-carousel__slide')
            if (slides.length < 2)
              return

            const firstSlide = slides[0] as HTMLElement
            const secondSlide = slides[1] as HTMLElement

            secondSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

            setTimeout(() => {
              setTimeout(() => {
                firstSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
              }, 300)
            }, 200)
          }, 1000)
        }
      })
    },
    { threshold: 0.5, rootMargin: '0px' },
  )

  return { setup: () => {} }
}
