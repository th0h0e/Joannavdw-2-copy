<script setup lang="ts">
import type { ProjectImage } from '~/shared/types/project'

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
const scrollProgress = ref(0)
const currentSlide = ref(0)
const isOnBlurSlide = ref(false)
const blurIntensity = ref(0)

const lastImage = computed(() => props.images[props.images.length - 1])
const titleText = computed(() => isOnBlurSlide.value ? 'NEXT PROJECT' : props.projectTitle)
const titleHidden = computed(() => props.isPopupVisible || props.isAboutPopupVisible)

const showBottomBar = computed(() => {
  if (isMobile.value) {
    return currentSlide.value > 0 && currentSlide.value <= props.images.length
  }
  return currentSlide.value > 0 && !isOnBlurSlide.value
})

const showTopBar = computed(() =>
  props.showTopProgressBar
  && isMobile.value
  && props.images.length > 1
  && currentSlide.value > 0
  && currentSlide.value <= props.images.length,
)

const showRightChevron = computed(() =>
  !isMobile.value
  && props.images.length > 1
  && currentSlide.value < props.images.length - 1,
)

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

function handleScroll() {
  const carousel = containerRef.value
  if (!carousel)
    return

  const scrollLeft = carousel.scrollLeft
  const containerWidth = carousel.offsetWidth
  const maxScroll = carousel.scrollWidth - containerWidth
  const rawProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0
  scrollProgress.value = rawProgress

  if (isMobile.value) {
    handleMobileScroll(rawProgress, carousel)
  }
  else {
    handleDesktopScroll(scrollLeft, containerWidth, maxScroll)
  }
}

function handleMobileScroll(rawProgress: number, carousel: HTMLElement) {
  const currentIndex = Math.round(rawProgress * (props.totalSlides - 1))
  const clampedIndex = Math.max(0, Math.min(currentIndex, props.totalSlides - 1))
  currentSlide.value = clampedIndex
  isOnBlurSlide.value = clampedIndex === props.totalSlides - 1
  calculateBlurIntensity(carousel)
}

function handleDesktopScroll(scrollLeft: number, containerWidth: number, maxScroll: number) {
  const halfWidth = containerWidth * 0.5

  if (scrollLeft >= maxScroll - 5) {
    currentSlide.value = props.totalSlides - 1
    isOnBlurSlide.value = true
  }
  else {
    const slideIndex = Math.round(scrollLeft / halfWidth)
    currentSlide.value = Math.min(slideIndex, props.images.length - 1)
    isOnBlurSlide.value = false
  }
}

function calculateBlurIntensity(carousel: HTMLElement) {
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

function handleKeyDown(e: KeyboardEvent) {
  if (isMobile.value)
    return

  const carousel = containerRef.value
  if (!carousel)
    return

  const halfWidth = carousel.offsetWidth * 0.5

  if (e.key === 'ArrowRight' && currentSlide.value < props.totalSlides - 1) {
    e.preventDefault()
    carousel.scrollTo({ left: (currentSlide.value + 1) * halfWidth, behavior: 'smooth' })
  }
  else if (e.key === 'ArrowLeft' && currentSlide.value > 0) {
    e.preventDefault()
    carousel.scrollTo({ left: (currentSlide.value - 1) * halfWidth, behavior: 'smooth' })
  }
}

function scrollToNextSection() {
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
  const carousel = containerRef.value
  if (!carousel)
    return

  const halfWidth = carousel.offsetWidth * 0.5
  carousel.scrollTo({ left: (currentSlide.value + 1) * halfWidth, behavior: 'smooth' })
}

onMounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    carousel.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
  if (!isMobile.value) {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    carousel.removeEventListener('scroll', handleScroll)
  }
  if (!isMobile.value) {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative h-full w-full bg-cover bg-center overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth motion-carousel"
    data-carousel
    :style="{ backgroundImage: `url(${lastImage.src})` }"
  >
    <div
      class="absolute inset-0 bg-cover bg-center z-[5]"
      :style="{ backgroundImage: `url(${lastImage.src})` }"
    />

    <div class="relative h-full w-full flex z-[10]">
      <template v-if="isMobile">
        <div
          v-for="(image, idx) in images.slice(0, -1)"
          :key="image.src"
          class="relative h-full w-full flex-shrink-0 min-w-full snap-center snap-always bg-cover bg-center bg-black motion-carousel__slide"
          :style="{ backgroundImage: `url(${image.src})` }"
          role="group"
          :aria-label="`Slide ${idx + 1}`"
        />

        <div
          class="relative h-full w-full flex-shrink-0 min-w-full snap-center snap-always bg-cover bg-center bg-no-repeat bg-transparent z-[15] opacity-0 motion-carousel__slide"
          role="group"
          :aria-label="`Slide ${images.length}`"
          :style="{ backgroundImage: `url(${lastImage.src})` }"
        />

        <button
          class="block bg-transparent z-[15] cursor-pointer appearance-none border-0 p-0 m-0 text-left relative h-full w-full flex-shrink-0 min-w-full snap-center snap-always motion-carousel__slide"
          aria-label="Go to next project"
          @click="scrollToNextSection"
          @keydown.down.prevent="scrollToNextSection"
        >
          <div class="absolute inset-0 z-[1] pointer-events-none">
            <div
              class="absolute inset-0 z-[1]"
              :style="{
                background: `rgba(0, 0, 0, ${0.25 * blurIntensity ** 2})`,
                backdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
                WebkitBackdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
                transition: 'none',
              }"
            >
              <div
                class="absolute bottom-5 left-1/2 z-[100] cursor-pointer hover:opacity-70 transition-opacity duration-300 pointer-events-auto"
                :style="{ opacity: blurIntensity ** 2, transform: 'translateX(-50%) translateZ(0)', willChange: 'transform, opacity' }"
              >
                <UIcon name="i-lucide-chevron-down" class="size-6" />
              </div>
            </div>
          </div>
        </button>
      </template>

      <template v-else>
        <div
          v-for="(image, idx) in images"
          :key="image.src"
          class="relative h-full flex-shrink-0 min-w-[50vw] w-[50vw] snap-center snap-always bg-cover bg-center bg-black"
          :style="{ backgroundImage: `url(${image.src})` }"
          role="group"
          :aria-label="`Slide ${idx + 1}`"
        />

        <button
          class="block min-w-[100vw]! w-[100vw]! bg-transparent z-[15] cursor-pointer appearance-none border-0 p-0 m-0 text-left relative h-full flex-shrink-0 snap-center snap-always"
          aria-label="Go to next project"
          @click="scrollToNextSection"
          @keydown.down.prevent="scrollToNextSection"
        >
          <div
            class="absolute inset-0 z-[1] bg-black/30 backdrop-blur-xl"
            style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
          />
        </button>
      </template>
    </div>
  </div>

  <div
    ref="projectTitleRef"
    class="absolute top-1/2 left-1/2 z-[200] text-center w-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
  >
    <button
      class="block w-full pointer-events-auto cursor-pointer appearance-none bg-none border-0 p-0 m-0 text-center text-white title-font transition-[opacity,visibility] duration-300 ease-in-out"
      :class="[titleHidden ? 'opacity-0 invisible' : 'opacity-100 visible']"
      @click="handleTitleClick"
      @keydown.enter.prevent="handleTitleClick"
    >
      {{ titleText }}
    </button>
  </div>

  <div
    v-if="images.length > 1"
    class="absolute left-0 right-0 z-20 flex justify-center px-6 transition-[opacity,transform] duration-150 ease-in-out"
    :class="[
      showBottomBar ? 'opacity-100' : 'opacity-0',
      isMobile ? 'bottom-5' : 'bottom-7 will-change-transform',
    ]"
    :style="{ pointerEvents: currentSlide > 0 ? 'auto' : 'none', transform: progressBarTransform }"
  >
    <div class="h-0.5 w-full max-w-md bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>
  </div>

  <div
    v-if="showTopBar"
    class="absolute top-5 left-0 right-0 z-20 flex justify-center px-6 transition-[opacity,transform] duration-150 ease-in-out"
    :class="[showBottomBar ? 'opacity-100' : 'opacity-0']"
    :style="{ pointerEvents: currentSlide > 0 ? 'auto' : 'none', transform: topProgressBarTransform }"
  >
    <div class="h-0.5 w-full max-w-md bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>
  </div>

  <div
    v-if="!isMobile && images.length > 1"
    class="absolute bottom-10 left-0 right-0 z-20 flex justify-center will-change-transform"
  >
    <button
      class="block cursor-pointer appearance-none bg-none border-0 p-0 m-0 transition-[opacity,transform] duration-150 ease-in-out"
      :class="[isOnBlurSlide ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2.5']"
      :style="{ transform: isOnBlurSlide ? 'translateY(0) translateZ(0)' : 'translateY(-10px) translateZ(0)' }"
      aria-label="Go to next project"
      @click="scrollToNextSection"
      @keydown.down.prevent="scrollToNextSection"
    >
      <UIcon name="i-lucide-chevron-down" class="size-6 hover:opacity-70 transition-opacity duration-300" />
    </button>
  </div>

  <button
    v-if="showRightChevron"
    class="absolute right-6 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer z-[250] transition-opacity duration-150 hover:opacity-70"
    aria-label="Next slide"
    @click="handleNextSlide"
  >
    <UIcon name="i-lucide-chevron-right" class="size-6 pointer-events-none" />
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
