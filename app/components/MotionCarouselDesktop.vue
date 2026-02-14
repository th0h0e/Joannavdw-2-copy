<script setup lang="ts">
import type { ProjectImage } from '~/shared/types/project'

const props = withDefaults(defineProps<{
  images: ProjectImage[]
  projectTitle: string
  totalSlides: number
  isPopupVisible?: boolean
  isAboutPopupVisible?: boolean
}>(), {
  isPopupVisible: false,
  isAboutPopupVisible: false,
})

const emit = defineEmits<{
  showPopup: [title: string]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const projectTitleRef = useTemplateRef('projectTitleRef')
const scrollProgress = ref(0)
const currentSlide = ref(0)
const isOnBlurSlide = ref(false)

const lastImage = computed(() => props.images[props.images.length - 1])
const titleText = computed(() => isOnBlurSlide.value ? 'NEXT PROJECT' : props.projectTitle)
const titleHidden = computed(() => props.isPopupVisible || props.isAboutPopupVisible)
const showRightChevron = computed(() =>
  props.images.length > 1
  && currentSlide.value < props.images.length - 1,
)

const progressBarVisible = computed(() => currentSlide.value > 0 && !isOnBlurSlide.value)
const progressBarTransform = computed(() =>
  progressBarVisible.value ? 'translateY(0) translateZ(0)' : 'translateY(10px) translateZ(0)',
)

function handleScroll() {
  const carousel = containerRef.value
  if (!carousel)
    return

  const scrollLeft = carousel.scrollLeft
  const containerWidth = carousel.offsetWidth
  const maxScroll = carousel.scrollWidth - containerWidth
  const rawProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0
  scrollProgress.value = rawProgress

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

function handleKeyDown(e: KeyboardEvent) {
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
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    carousel.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('keydown', handleKeyDown)
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
    class="absolute bottom-7 left-0 right-0 z-20 flex justify-center px-6 will-change-transform"
  >
    <div
      class="w-full max-w-md transition-[opacity,transform] duration-150 ease-in-out"
      :class="[progressBarVisible ? 'opacity-100' : 'opacity-0']"
      :style="{ pointerEvents: progressBarVisible ? 'auto' : 'none', transform: progressBarTransform }"
    >
      <div class="h-0.5 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
      </div>
    </div>
  </div>

  <div
    v-if="images.length > 1"
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
