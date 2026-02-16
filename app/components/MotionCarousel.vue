<script setup lang="ts">
import type { ProjectImage } from '~/shared/types/project'
import { onKeyDown, useElementSize, useScroll } from '@vueuse/core'

const props = withDefaults(defineProps<{
  images: ProjectImage[]
  projectTitle: string
  totalSlides: number
  showTopProgressBar?: boolean
  isPopupVisible?: boolean
  isAboutPopupVisible?: boolean
}>(), {
  showTopProgressBar: true,
  isPopupVisible: false,
  isAboutPopupVisible: false,
})

const emit = defineEmits<{
  showPopup: [title: string]
}>()

const { isMobile } = useDevice()

const containerRef = ref<HTMLDivElement | null>(null)
const projectTitleRef = useTemplateRef('projectTitleRef')

const { x: scrollX } = useScroll(containerRef, { behavior: 'smooth' })
const { width: containerWidth } = useElementSize(containerRef)

const blurIntensity = ref(0)

const halfWidth = computed(() => containerWidth.value * 0.5)

const maxScroll = computed(() => {
  const carousel = containerRef.value
  if (!carousel)
    return 0
  return carousel.scrollWidth - containerWidth.value
})

const scrollProgress = computed(() => {
  if (maxScroll.value <= 0)
    return 0
  return scrollX.value / maxScroll.value
})

const currentSlide = computed(() => {
  if (isMobile) {
    const currentIndex = Math.round(scrollProgress.value * (props.totalSlides - 1))
    return Math.max(0, Math.min(currentIndex, props.totalSlides - 1))
  }

  if (halfWidth.value <= 0)
    return 0

  if (scrollX.value >= maxScroll.value - 5) {
    return props.totalSlides - 1
  }
  const slideIndex = Math.round(scrollX.value / halfWidth.value)
  return Math.min(slideIndex, props.images.length - 1)
})

const isOnBlurSlide = computed(() => {
  if (isMobile) {
    return currentSlide.value === props.totalSlides - 1
  }
  return scrollX.value >= maxScroll.value - 5
})

const lastImage = computed(() => props.images[props.images.length - 1])
const titleText = computed(() => isOnBlurSlide.value ? 'NEXT PROJECT' : props.projectTitle)
const titleHidden = computed(() => props.isPopupVisible || props.isAboutPopupVisible)

const showBottomBar = computed(() => {
  if (isMobile) {
    return currentSlide.value > 0 && currentSlide.value <= props.images.length
  }
  return currentSlide.value > 0 && !isOnBlurSlide.value
})

const showTopBar = computed(() =>
  props.showTopProgressBar
  && isMobile
  && props.images.length > 1
  && currentSlide.value > 0
  && currentSlide.value <= props.images.length)

const showRightChevron = computed(() =>
  !isMobile
  && props.images.length > 1
  && currentSlide.value < props.images.length - 1)

const progressBarTransform = computed(() => {
  if (showBottomBar.value) {
    return 'translateY(0) translateZ(0)'
  }
  return 'translateY(10px) translateZ(0)'
})

const topProgressBarTransform = computed(() => {
  if (showBottomBar.value) {
    return 'translateY(0)'
  }
  return 'translateY(-10px)'
})

watch(scrollX, () => {
  if (isMobile) {
    calculateBlurIntensity()
  }
})

function calculateBlurIntensity() {
  const carousel = containerRef.value
  if (!carousel)
    return

  const slides = carousel.querySelectorAll('.motion-carousel__slide')
  const blurSlide = slides[slides.length - 1] as HTMLElement
  if (!blurSlide)
    return

  const blurSlideRect = blurSlide.getBoundingClientRect()
  const carouselRect = carousel.getBoundingClientRect()

  const blurSlideLeft = blurSlideRect.left - carouselRect.left
  const carouselWidth = carouselRect.width
  const slideWidth = blurSlideRect.width
  const idealCenterPosition = (carouselWidth - slideWidth) / 2
  const distanceFromCenter = Math.abs(blurSlideLeft - idealCenterPosition)
  const maxDistance = carouselWidth - idealCenterPosition

  let visibility = 0
  if (maxDistance > 0) {
    const raw = 1 - (distanceFromCenter / maxDistance)
    const delayThreshold = 0.5
    if (raw > delayThreshold) {
      visibility = (raw - delayThreshold) / (1 - delayThreshold)
    }
    visibility = Math.max(0, Math.min(1, visibility))
  }

  blurIntensity.value = visibility
}

if (!isMobile) {
  const cleanupRight = onKeyDown('ArrowRight', (e) => {
    if (currentSlide.value < props.totalSlides - 1) {
      e.preventDefault()
      scrollX.value = (currentSlide.value + 1) * halfWidth.value
    }
  })

  const cleanupLeft = onKeyDown('ArrowLeft', (e) => {
    if (currentSlide.value > 0) {
      e.preventDefault()
      scrollX.value = (currentSlide.value - 1) * halfWidth.value
    }
  })

  onUnmounted(() => {
    cleanupRight()
    cleanupLeft()
  })
}

function scrollToNextSection() {
  if (import.meta.server)
    return
  const main = document.querySelector('main')
  if (main) {
    main.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }
}

function handleTitleClick() {
  if (isOnBlurSlide.value) {
    scrollToNextSection()
  }
  else {
    emit('showPopup', props.projectTitle)
  }
}

function handleNextSlide() {
  scrollX.value = (currentSlide.value + 1) * halfWidth.value
}
</script>

<template>
  <div
    ref="containerRef"
    class="motion-carousel relative h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth bg-cover bg-center"
    data-carousel
    :style="{ backgroundImage: `url(${lastImage.src})` }"
  >
    <div
      class="absolute inset-0 z-5 bg-cover bg-center"
      :style="{ backgroundImage: `url(${lastImage.src})` }"
    />

    <div class="relative z-10 flex h-full w-full">
      <template v-if="isMobile">
        <div
          v-for="(image, idx) in images.slice(0, -1)"
          :key="image.src"
          class="motion-carousel__slide relative h-full w-full min-w-full flex-shrink-0 snap-center snap-always bg-black bg-cover bg-center"
          :style="{ backgroundImage: `url(${image.src})` }"
          role="group"
          :aria-label="`Slide ${idx + 1}`"
        />

        <div
          class="motion-carousel__slide relative z-15 h-full w-full min-w-full flex-shrink-0 snap-center snap-always bg-transparent bg-cover bg-center bg-no-repeat opacity-0"
          role="group"
          :aria-label="`Slide ${images.length}`"
          :style="{ backgroundImage: `url(${lastImage.src})` }"
        />

        <button
          class="motion-carousel__slide relative z-15 m-0 block h-full w-full min-w-full flex-shrink-0 cursor-pointer snap-center snap-always appearance-none border-0 bg-transparent p-0 text-left"
          aria-label="Go to next project"
          @click="scrollToNextSection"
          @keydown.down.prevent="scrollToNextSection"
        >
          <div class="pointer-events-none absolute inset-0 z-1">
            <div
              class="absolute inset-0 z-1"
              :style="{
                background: `rgba(0, 0, 0, ${0.25 * blurIntensity ** 2})`,
                backdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
                WebkitBackdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
                transition: 'none',
              }"
            >
              <div
                class="pointer-events-auto absolute bottom-5 left-1/2 z-100 cursor-pointer transition-opacity duration-300 hover:opacity-70"
                :style="{ opacity: blurIntensity ** 2, transform: 'translateX(-50%) translateZ(0)', willChange: 'transform, opacity' }"
              >
                <UIcon
                  name="i-lucide-chevron-down"
                  class="size-6 text-white"
                />
              </div>
            </div>
          </div>
        </button>
      </template>

      <template v-else>
        <div
          v-for="(image, idx) in images"
          :key="image.src"
          class="relative h-full w-[50vw] min-w-[50vw] flex-shrink-0 snap-center snap-always bg-black bg-cover bg-center"
          :style="{ backgroundImage: `url(${image.src})` }"
          role="group"
          :aria-label="`Slide ${idx + 1}`"
        />

        <button
          class="relative z-15 m-0 block h-full w-[100vw]! min-w-[100vw]! flex-shrink-0 cursor-pointer snap-center snap-always appearance-none border-0 bg-transparent p-0 text-left"
          aria-label="Go to next project"
          @click="scrollToNextSection"
          @keydown.down.prevent="scrollToNextSection"
        >
          <div
            class="absolute inset-0 z-1 bg-black/30 backdrop-blur-xl"
            style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
          />
        </button>
      </template>
    </div>
  </div>

  <div
    ref="projectTitleRef"
    class="pointer-events-none absolute top-1/2 left-1/2 z-200 w-full -translate-x-1/2 -translate-y-1/2 text-center"
  >
    <button
      class="title-font pointer-events-auto m-0 block w-full cursor-pointer appearance-none border-0 bg-none p-0 text-center text-white transition-[opacity,visibility] duration-300 ease-in-out"
      :class="[titleHidden ? 'invisible opacity-0' : 'visible opacity-100']"
      @click="handleTitleClick"
      @keydown.enter.prevent="handleTitleClick"
    >
      {{ titleText }}
    </button>
  </div>

  <div
    v-if="images.length > 1"
    class="absolute right-0 left-0 z-20 flex justify-center px-6 transition-[opacity,transform] duration-150 ease-in-out"
    :class="[
      showBottomBar ? 'opacity-100' : 'opacity-0',
      isMobile ? 'bottom-5' : 'bottom-7 will-change-transform',
    ]"
    :style="{ pointerEvents: currentSlide > 0 ? 'auto' : 'none', transform: progressBarTransform }"
  >
    <UProgress
      :model-value="scrollProgress"
      :max="1"
      size="xs"
      :ui="{
        base: 'bg-gray-500/50 backdrop-blur-sm',
        indicator: 'bg-gray-50',
      }"
      class="w-[80vw]"
    />
  </div>

  <div
    v-if="showTopBar"
    class="absolute top-5 right-0 left-0 z-20 flex justify-center px-6 transition-[opacity,transform] duration-150 ease-in-out"
    :class="[showBottomBar ? 'opacity-100' : 'opacity-0']"
    :style="{ pointerEvents: currentSlide > 0 ? 'auto' : 'none', transform: topProgressBarTransform }"
  >
    <UProgress
      :model-value="scrollProgress"
      :max="1"
      size="xs"
      :ui="{
        base: 'bg-gray-500/50 backdrop-blur-sm',
        indicator: 'bg-gray-50',
      }"
      class="w-[80vw]"
    />
  </div>

  <div
    v-if="!isMobile && images.length > 1"
    class="absolute right-0 bottom-10 left-0 z-20 flex justify-center will-change-transform"
  >
    <button
      class="m-0 block cursor-pointer appearance-none border-0 bg-none p-0 transition-[opacity,transform] duration-150 ease-in-out"
      :class="[isOnBlurSlide ? 'translate-y-0 opacity-100' : '-translate-y-2.5 opacity-0']"
      :style="{ transform: isOnBlurSlide ? 'translateY(0) translateZ(0)' : 'translateY(-10px) translateZ(0)' }"
      aria-label="Go to next project"
      @click="scrollToNextSection"
      @keydown.down.prevent="scrollToNextSection"
    >
      <UIcon
        name="i-lucide-chevron-down"
        class="size-6 text-white transition-opacity duration-300 hover:opacity-70"
      />
    </button>
  </div>

  <button
    v-if="showRightChevron"
    class="absolute top-1/2 right-6 z-250 -translate-y-1/2 cursor-pointer border-none bg-none transition-opacity duration-150 hover:opacity-70"
    aria-label="Next slide"
    @click="handleNextSlide"
  >
    <UIcon
      name="i-lucide-chevron-right"
      class="pointer-events-none size-6 text-white"
    />
  </button>
</template>

<style scoped>
.motion-carousel {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-align: none;
}

.motion-carousel::-webkit-scrollbar {
  display: none;
}
</style>
