<script setup lang="ts">
import type { Settings } from '@/config/pocketbase'
import type { ProjectImage } from '@/types/project'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getResponsiveFontSizes } from '@/config/pocketbase'
import { projectTitleClasses, projectTitleContainerClasses } from '@/utils/sharedStyles'
import ChevronDown from './icons/ChevronDown.vue'
import ChevronRight from './icons/ChevronRight.vue'

const props = withDefaults(defineProps<{
  images: ProjectImage[]
  projectTitle: string
  settingsData?: Settings | null
  totalSlides: number
  isPopupVisible?: boolean
  isAboutPopupVisible?: boolean
}>(), {
  settingsData: null,
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

const fontSizes = computed(() => getResponsiveFontSizes(props.settingsData))
const lastImage = computed(() => props.images[props.images.length - 1])

const handleScroll = () => {
  const carousel = containerRef.value
  if (!carousel) return

  const scrollLeft = carousel.scrollLeft
  const containerWidth = carousel.offsetWidth
  const maxScroll = carousel.scrollWidth - containerWidth
  const rawProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0
  scrollProgress.value = rawProgress

  const halfWidth = containerWidth * 0.5

  if (scrollLeft >= maxScroll - 5) {
    currentSlide.value = props.totalSlides - 1
    isOnBlurSlide.value = true
  } else {
    const slideIndex = Math.round(scrollLeft / halfWidth)
    const actualSlide = Math.min(slideIndex, props.images.length - 1)
    currentSlide.value = actualSlide
    isOnBlurSlide.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  const carousel = containerRef.value
  if (!carousel) return

  const containerWidth = carousel.offsetWidth
  const halfWidth = containerWidth * 0.5

  if (e.key === 'ArrowRight' && currentSlide.value < props.totalSlides - 1) {
    e.preventDefault()
    const nextSlideIndex = currentSlide.value + 1
    carousel.scrollTo({ left: nextSlideIndex * halfWidth, behavior: 'smooth' })
  } else if (e.key === 'ArrowLeft' && currentSlide.value > 0) {
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

const scrollToNextSection = () => {
  const main = document.querySelector('main')
  if (main) {
    main.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }
}

const handleTitleClick = () => {
  if (isOnBlurSlide.value) {
    scrollToNextSection()
  } else {
    emit('showPopup', props.projectTitle)
  }
}

const handleNextSlide = () => {
  const carousel = containerRef.value
  if (!carousel) return
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
  <component :is="'style'">
    .motion-carousel-desktop {
      position: relative; height: 100%; width: 100%;
      background-size: cover; background-position: center;
      overflow-x: auto; overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory; scroll-behavior: smooth;
      scrollbar-width: none; -ms-overflow-style: none;
      scroll-snap-align: none;
    }
    .motion-carousel-desktop::-webkit-scrollbar { display: none; }
    .motion-carousel-desktop__background {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover; background-position: center; z-index: 5;
    }
    .motion-carousel-desktop__container {
      position: relative; height: 100%; width: 100%; display: flex; z-index: 10;
    }
    .motion-carousel-desktop__slide {
      position: relative; height: 100%; flex-shrink: 0;
      min-width: 50vw; width: 50vw;
      scroll-snap-align: center; scroll-snap-stop: always;
      background-size: cover; background-position: center; background-color: black;
    }
    .motion-carousel-desktop__slide--blur {
      min-width: 100vw !important; width: 100vw !important;
      background: transparent; z-index: 15;
    }
    .motion-project-title-desktop {
      font-size: {{ fontSizes.desktop }}rem;
    }
    @media (min-width: 1280px) {
      .motion-project-title-desktop { font-size: {{ fontSizes.largeDesktop }}rem; }
    }
  </component>

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
      <div
        class="motion-carousel-desktop__slide motion-carousel-desktop__slide--blur"
        role="group"
        aria-label="Next section"
        style="cursor: pointer"
        @click="scrollToNextSection"
      >
        <div :style="{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 1,
        }" />
      </div>
    </div>
  </div>

  <!-- Project Title -->
  <div
    :class="`absolute top-1/2 left-1/2 z-[200] text-center w-full ${projectTitleContainerClasses}`"
    :style="{ transform: 'translate(-50%, -50%)', pointerEvents: 'none' }"
  >
    <h1
      :class="`text-white ${projectTitleClasses} motion-project-title-desktop`"
      :style="{
        fontFamily: 'EnduroWeb, sans-serif',
        letterSpacing: '0.03em',
        pointerEvents: 'auto',
        cursor: 'pointer',
        opacity: titleHidden ? 0 : 1,
        visibility: titleHidden ? 'hidden' : 'visible',
        transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
      }"
      @click="handleTitleClick"
    >
      {{ titleText }}
    </h1>
  </div>

  <!-- Progress Bar -->
  <div
    v-if="images.length > 1"
    class="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 w-4/5"
    :style="{ transform: 'translate(-50%, 0) translateZ(0)', willChange: 'transform' }"
  >
    <div :style="{
      opacity: currentSlide > 0 && !isOnBlurSlide ? 1 : 0,
      transform: !isOnBlurSlide ? 'translateY(0) translateZ(0)' : 'translateY(10px) translateZ(0)',
      transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
      pointerEvents: currentSlide > 0 && !isOnBlurSlide ? 'auto' : 'none',
      width: '100%',
    }">
      <div class="h-0.5 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
      </div>
    </div>
  </div>

  <!-- Chevron Down -->
  <div
    v-if="images.length > 1"
    class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
    :style="{ transform: 'translate(-50%, 0) translateZ(0)', willChange: 'transform' }"
  >
    <div
      :style="{
        opacity: isOnBlurSlide ? 1 : 0,
        transform: isOnBlurSlide ? 'translateY(0) translateZ(0)' : 'translateY(-10px) translateZ(0)',
        transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
        pointerEvents: isOnBlurSlide ? 'auto' : 'none',
        cursor: 'pointer',
      }"
      @click="scrollToNextSection"
    >
      <ChevronDown
        :width="28"
        :height="28"
        color="white"
        class="drop-shadow-2xl hover:opacity-70 transition-opacity duration-300"
      />
    </div>
  </div>

  <!-- Right Chevron -->
  <button
    v-if="showRightChevron"
    class="absolute right-6 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer z-[250] transition-opacity duration-150 hover:opacity-70"
    style="opacity: 1"
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
