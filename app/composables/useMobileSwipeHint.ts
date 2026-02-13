// composables/useMobileSwipeHint.ts
export function useMobileSwipeHint(isDesktop: Ref<boolean>, projectCount: Ref<number>) {
  const hasShownMobileHint = ref(false)

  function setup() {
    if (isDesktop.value || hasShownMobileHint.value || projectCount.value === 0)
      return

    const hintObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasShownMobileHint.value) {
            hasShownMobileHint.value = true
            hintObserver.disconnect()

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

    const firstProjectSection = document.getElementById('project-0')
    if (firstProjectSection)
      hintObserver.observe(firstProjectSection)
  }

  watch(projectCount, () => {
    nextTick(() => setup())
  })

  return { setup }
}
