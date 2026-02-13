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
const scrollProgress = ref(0)
const currentSlide = ref(0)
const isOnBlurSlide = ref(false)

const lastImage = computed(() => props.images[props.images.length - 1])

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
    const actualSlide = Math.min(slideIndex, props.images.length - 1)
    currentSlide.value = actualSlide
    isOnBlurSlide.value = false
  }
}

function handleKeyDown(e: KeyboardEvent) {
  const carousel = containerRef.value
  if (!carousel)
    return

  const containerWidth = carousel.offsetWidth
  const halfWidth = containerWidth * 0.5

  if (e.key === 'ArrowRight' && currentSlide.value < props.totalSlides - 1) {
    e.preventDefault()
    const nextSlideIndex = currentSlide.value + 1
    carousel.scrollTo({ left: nextSlideIndex * halfWidth, behavior: 'smooth' })
  }
  else if (e.key === 'ArrowLeft' && currentSlide.value > 0) {
    e.preventDefault()
    const prevSlideIndex = currentSlide.value - 1
    carousel.scrollTo({ left: prevSlideIndex * halfWidth, behavior: 'smooth' })
  }
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
  const containerWidth = carousel.offsetWidth
  const halfWidth = containerWidth * 0.5
  const nextSlideIndex = currentSlide.value + 1
  carousel.scrollTo({ left: nextSlideIndex * halfWidth, behavior: 'smooth' })
}

const titleText = computed(() => isOnBlurSlide.value ? 'NEXT PROJECT' : props.projectTitle)
const titleHidden = computed(() => props.isPopupVisible || props.isAboutPopupVisible)
const showRightChevron = computed(() => props.images.length > 1 && currentSlide.value < props.images.length - 1)
</script>

<template>
  <div
    ref="containerRef"
    class="motion-carousel-desktop"
    data-carousel
    :style="{ backgroundImage: `url(${lastImage.src})` }"
  >
    <div class="motion-carousel-desktop__background" :style="{ backgroundImage: `url(${lastImage.src})` }" />

    <div class="motion-carousel-desktop__container">
      <!-- Regular image slides -->
      <div
        v-for="(image, idx) in images"
        :key="image.src"
        class="motion-carousel-desktop__slide"
        :style="{ backgroundImage: `url(${image.src})` }"
        role="group"
        :aria-label="`Slide ${idx + 1}`"
      />

      <!-- Blur slide -->
      <button
        class="motion-carousel-desktop__slide motion-carousel-desktop__slide--blur"
        aria-label="Go to next project"
        @click="scrollToNextSection"
        @keydown.down.prevent="scrollToNextSection"
      >
        <div class="blur-overlay-inner" />
      </button>
    </div>
  </div>

  <!-- Project Title -->
  <div
    :class="`project-title-container absolute top-1/2 left-1/2 z-[200] text-center w-full ${projectTitleContainerClasses}`"
  >
    <button
      :class="[
        'text-white motion-project-title-desktop title-font',
        { 'motion-project-title-desktop--hidden': titleHidden }
      ]"
      @click="handleTitleClick"
      @keydown.enter.prevent="handleTitleClick"
    >
      {{ titleText }}
    </button>
  </div>

  <!-- Progress Bar -->
  <div
    v-if="images.length > 1"
    class="progress-bar-wrapper absolute bottom-7 left-1/2 -translate-x-1/2 z-20 w-4/5"
  >
    <div
      class="progress-bar-inner"
      :class="{ 'progress-bar-inner--visible': currentSlide > 0 && !isOnBlurSlide }"
      :style="{ pointerEvents: currentSlide > 0 && !isOnBlurSlide ? 'auto' : 'none' }"
    >
      <div class="h-0.5 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
      </div>
    </div>
  </div>

  <!-- Chevron Down -->
  <div
    v-if="images.length > 1"
    class="chevron-down-wrapper absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
  >
    <button
      class="chevron-down-inner"
      :class="{ 'chevron-down-inner--visible': isOnBlurSlide }"
      aria-label="Go to next project"
      @click="scrollToNextSection"
      @keydown.down.prevent="scrollToNextSection"
    >
      <ChevronDown
        :width="28"
        :height="28"
        color="white"
        class="drop-shadow-2xl hover:opacity-70 transition-opacity duration-300"
      />
    </button>
  </div>

  <!-- Right Chevron -->
  <button
    v-if="showRightChevron"
    class="right-chevron absolute right-6 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer z-[250] transition-opacity duration-150 hover:opacity-70"
    aria-label="Next slide"
    @click="handleNextSlide"
  >
    <ChevronRight
      :width="28"
      :height="28"
      color="white"
      class="drop-shadow-2xl pointer-events-none"
    />
  </button>
</template>

<style scoped>
.motion-carousel-desktop {
  position: relative;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-align: none;
}

.motion-carousel-desktop::-webkit-scrollbar {
  display: none;
}

.motion-carousel-desktop__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 5;
}

.motion-carousel-desktop__container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  z-index: 10;
}

.motion-carousel-desktop__slide {
  position: relative;
  height: 100%;
  flex-shrink: 0;
  min-width: 50vw;
  width: 50vw;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  background-size: cover;
  background-position: center;
  background-color: black;
}

.motion-carousel-desktop__slide--blur {
  display: block;
  min-width: 100vw !important;
  width: 100vw !important;
  background: transparent;
  z-index: 15;
  cursor: pointer;
  appearance: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: left;
}

.blur-overlay-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1;
}

.motion-project-title-desktop {
  display: block;
  width: 100%;
  pointer-events: auto;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  text-align: center;
}

.motion-project-title-desktop--hidden {
  opacity: 0;
  visibility: hidden;
}

.project-title-container {
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.progress-bar-wrapper {
  transform: translate(-50%, 0) translateZ(0);
  will-change: transform;
}

.progress-bar-inner {
  width: 100%;
  opacity: 0;
  transform: translateY(10px) translateZ(0);
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
}

.progress-bar-inner--visible {
  opacity: 1;
  transform: translateY(0) translateZ(0);
}

.chevron-down-wrapper {
  transform: translate(-50%, 0) translateZ(0);
  will-change: transform;
}

.chevron-down-inner {
  display: block;
  opacity: 0;
  transform: translateY(-10px) translateZ(0);
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
  cursor: pointer;
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
}

.chevron-down-inner--visible {
  opacity: 1;
  transform: translateY(0) translateZ(0);
}

.right-chevron {
  opacity: 1;
}

</style>
