<script setup lang="ts">
import type { Settings } from '@/plugins/pocketbase'
import type { ProjectImage } from '@/shared/types/project'
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { getResponsiveFontSizes } from '@/plugins/pocketbase'
import { projectTitleClasses, projectTitleContainerClasses } from '@/utils/sharedStyles'
import ChevronDown from './icons/ChevronDown.vue'

const props = withDefaults(defineProps<{
  images: ProjectImage[]
  projectTitle: string
  settingsData?: Settings | null
  totalSlides: number
  showTopProgressBar?: boolean
  isPopupVisible?: boolean
  isAboutPopupVisible?: boolean
}>(), {
  settingsData: null,
  showTopProgressBar: true,
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
const blurIntensity = ref(0)

const fontSizes = computed(() => getResponsiveFontSizes(props.settingsData))
const lastImage = computed(() => props.images[props.images.length - 1])

// Dynamic style injection for carousel and responsive font sizes
const styleEl = document.createElement('style')
document.head.appendChild(styleEl)
watchEffect(() => {
  styleEl.textContent = `
    .motion-carousel {
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
    }
    .motion-carousel::-webkit-scrollbar { display: none; }
    .motion-carousel__background {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover; background-position: center; z-index: 5;
    }
    .motion-carousel__container {
      position: relative; height: 100%; width: 100%; display: flex; z-index: 10;
    }
    .motion-carousel__slide {
      position: relative; height: 100%; width: 100%; flex-shrink: 0;
      min-width: 100%; scroll-snap-align: center; scroll-snap-stop: always;
    }
    .motion-carousel__slide--image {
      background-size: cover; background-position: center; background-color: black;
    }
    .motion-carousel__slide--transparent {
      background: transparent; z-index: 15; opacity: 0;
      background-size: cover; background-position: center; background-repeat: no-repeat;
    }
    .motion-carousel__slide--blur {
      background: transparent; z-index: 15;
    }
    .motion-carousel__slide--blur > .blur-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 1; pointer-events: none;
    }
    .motion-carousel__slide--blur > .blur-overlay > .black-blur-div {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
    }
    .motion-project-title {
      font-size: ${fontSizes.value.mobile}rem;
    }
    @media (min-width: 768px) {
      .motion-project-title { font-size: ${fontSizes.value.tablet}rem; }
    }
    @media (min-width: 1024px) {
      .motion-project-title { font-size: ${fontSizes.value.desktop}rem; }
    }
    @media (min-width: 1280px) {
      .motion-project-title { font-size: ${fontSizes.value.largeDesktop}rem; }
    }
  `
})
onBeforeUnmount(() => {
  styleEl.remove()
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

  const scrollPercentage = rawProgress
  const currentIndex = Math.round(scrollPercentage * (props.totalSlides - 1))
  const clampedIndex = Math.max(0, Math.min(currentIndex, props.totalSlides - 1))
  currentSlide.value = clampedIndex

  const isBlur = clampedIndex === props.totalSlides - 1
  isOnBlurSlide.value = isBlur

  // Calculate blur slide visibility
  const slides = carousel.querySelectorAll('.motion-carousel__slide')
  const blurSlide = slides[slides.length - 1] as HTMLElement
  if (blurSlide) {
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
}

onMounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    carousel.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
})

onUnmounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    carousel.removeEventListener('scroll', handleScroll)
  }
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

const titleText = computed(() => isOnBlurSlide.value ? 'NEXT PROJECT' : props.projectTitle)
const titleHidden = computed(() => props.isPopupVisible || props.isAboutPopupVisible)
const chevronSize = computed(() => window.innerWidth >= 768 ? 28 : 24)

const showBottomBar = computed(() => currentSlide.value > 0 && currentSlide.value <= props.images.length)
const showTopBar = computed(() => props.showTopProgressBar && props.images.length > 1 && currentSlide.value > 0 && currentSlide.value <= props.images.length)
</script>

<template>
  <div
    ref="containerRef"
    class="motion-carousel"
    data-carousel
    :style="{ backgroundImage: `url(${lastImage.src})` }"
  >
    <!-- Background image for blur effect -->
    <div class="motion-carousel__background" :style="{ backgroundImage: `url(${lastImage.src})` }" />

    <!-- Carousel slides container -->
    <div class="motion-carousel__container">
      <!-- Regular image slides (all except last) -->
      <div
        v-for="(image, idx) in images.slice(0, -1)"
        :key="image.src"
        class="motion-carousel__slide motion-carousel__slide--image"
        :style="{ backgroundImage: `url(${image.src})` }"
        role="group"
        :aria-label="`Slide ${idx + 1}`"
      />

      <!-- Transparent slide -->
      <div
        class="motion-carousel__slide motion-carousel__slide--transparent"
        role="group"
        :aria-label="`Slide ${images.length}`"
        :style="{ backgroundImage: `url(${lastImage.src})` }"
      />

      <!-- Blur slide -->
      <div
        class="motion-carousel__slide motion-carousel__slide--blur"
        role="group"
        aria-label="Next section"
        style="cursor: pointer"
        @click="scrollToNextSection"
      >
        <div class="blur-overlay">
          <div
            class="black-blur-div"
            :style="{
              background: `rgba(0, 0, 0, ${0.25 * blurIntensity ** 2})`,
              backdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
              WebkitBackdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
              transition: 'none',
            }"
          >
            <!-- Down Chevron -->
            <div
              class="absolute bottom-5 left-1/2 z-[100] cursor-pointer hover:opacity-70 transition-opacity duration-300 pointer-events-auto"
              :style="{
                opacity: blurIntensity ** 2,
                transform: 'translateX(-50%) translateZ(0)',
                willChange: 'transform, opacity',
              }"
            >
              <ChevronDown
                :width="chevronSize"
                :height="chevronSize"
                color="white"
                class="drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Project Title - Centered overlay -->
  <div
    :class="`absolute top-1/2 left-1/2 z-[200] text-center w-full ${projectTitleContainerClasses}`"
    :style="{ transform: 'translate(-50%, -50%)', pointerEvents: 'none' }"
  >
    <h1
      :class="`text-white ${projectTitleClasses} motion-project-title`"
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

  <!-- Progress Bar (Bottom) -->
  <div
    v-if="images.length > 1"
    class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-full px-6"
    :style="{
      opacity: showBottomBar ? 1 : 0,
      transform: showBottomBar ? 'translate(-50%, 0)' : 'translate(-50%, 10px)',
      transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
      pointerEvents: currentSlide > 0 ? 'auto' : 'none',
    }"
  >
    <div class="h-0.5 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>
  </div>

  <!-- Progress Bar (Top) -->
  <div
    v-if="showTopBar"
    class="absolute top-5 left-1/2 -translate-x-1/2 z-20 w-full px-6"
    :style="{
      opacity: showBottomBar ? 1 : 0,
      transform: showBottomBar ? 'translate(-50%, 0)' : 'translate(-50%, -10px)',
      transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
      pointerEvents: currentSlide > 0 ? 'auto' : 'none',
    }"
  >
    <div class="h-0.5 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>
  </div>
</template>
