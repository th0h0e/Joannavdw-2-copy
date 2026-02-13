// composables/useCarouselReset.ts
export function useCarouselReset(projectCount: Ref<number>) {
  function resetInactiveCarousels(currentSectionId: string) {
    setTimeout(() => {
      for (let index = 0; index < projectCount.value; index++) {
        const sectionId = `project-${index}`
        if (sectionId === currentSectionId)
          continue
        const section = document.getElementById(sectionId)
        if (!section)
          continue
        const carousel = section.querySelector('.motion-carousel, .motion-carousel-desktop') as HTMLElement
        if (!carousel)
          continue
        carousel.scrollLeft = 0
      }
    }, 300)
  }

  return { resetInactiveCarousels }
}
