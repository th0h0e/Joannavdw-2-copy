<script setup lang="ts">
import type { ProjectImage } from '~/shared/types/project'

/*
 * =============================================================================
 * PROPS
 * =============================================================================
 * These are passed from the parent component (index.vue)
 */
const props = withDefaults(defineProps<{
  images: ProjectImage[] // Array of project images to display in carousel
  projectTitle: string // Title of the current project
  totalSlides: number // Total number of slides (images + transparent + blur)
  showTopProgressBar?: boolean // Whether to show progress bar at top (default: true)
  isPopupVisible?: boolean // Whether project popup is open (for hiding title)
  isAboutPopupVisible?: boolean // Whether about popup is open (for hiding title)
}>(), {
  showTopProgressBar: true,
  isPopupVisible: false,
  isAboutPopupVisible: false,
})

/*
 * =============================================================================
 * EVENTS
 * =============================================================================
 * Emits events to parent component
 */
const emit = defineEmits<{
  showPopup: [title: string] // Emitted when user clicks project title
}>()

/*
 * =============================================================================
 * REACTIVE STATE
 * =============================================================================
 */
const containerRef = ref<HTMLDivElement | null>(null) // Reference to carousel DOM element
const projectTitleRef = useTemplateRef('projectTitleRef') // Reference to project title element (Nuxt 3.14+)
const scrollProgress = ref(0) // Current scroll progress (0 to 1)
const currentSlide = ref(0) // Current slide index (0-based)
const isOnBlurSlide = ref(false) // Whether user is on the blur slide (last slide)
const blurIntensity = ref(0) // How visible the blur effect is (0 to 1)

/*
 * =============================================================================
 * COMPUTED PROPERTIES
 * =============================================================================
 */
// Get the last image for background display
const lastImage = computed(() => props.images[props.images.length - 1])

// Show project title or "NEXT PROJECT" text based on current slide
const titleText = computed(() => isOnBlurSlide.value ? 'NEXT PROJECT' : props.projectTitle)

// Hide title when either popup is visible
const titleHidden = computed(() => props.isPopupVisible || props.isAboutPopupVisible)

// Show bottom progress bar when scrolled past first slide
const showBottomBar = computed(() => currentSlide.value > 0 && currentSlide.value <= props.images.length)

// Show top progress bar only when enabled, has multiple images, and not on first/last slide
const showTopBar = computed(() =>
  props.showTopProgressBar
  && props.images.length > 1
  && currentSlide.value > 0
  && currentSlide.value <= props.images.length,
)

/*
 * =============================================================================
 * SCROLL HANDLING
 * =============================================================================
 * Tracks scroll position and calculates:
 * - Current slide index
 * - Whether on blur slide
 * - Blur intensity (based on how centered the blur slide is)
 */
function handleScroll() {
  const carousel = containerRef.value
  if (!carousel)
    return

  // Calculate scroll progress as percentage (0 to 1)
  const scrollLeft = carousel.scrollLeft
  const containerWidth = carousel.offsetWidth
  const maxScroll = carousel.scrollWidth - containerWidth
  const rawProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0
  scrollProgress.value = rawProgress

  // Convert scroll progress to current slide index
  const scrollPercentage = rawProgress
  const currentIndex = Math.round(scrollPercentage * (props.totalSlides - 1))
  const clampedIndex = Math.max(0, Math.min(currentIndex, props.totalSlides - 1))
  currentSlide.value = clampedIndex

  // Check if user is on the blur slide (last slide)
  const isBlur = clampedIndex === props.totalSlides - 1
  isOnBlurSlide.value = isBlur

  // Calculate blur intensity based on how centered the blur slide is
  calculateBlurIntensity(carousel)
}

/*
 * =============================================================================
 * BLUR INTENSITY CALCULATION
 * =============================================================================
 * Determines how strong the blur effect should be based on slide position.
 * When the blur slide is centered, blur is strongest. As user scrolls away,
 * the blur fades out.
 */
function calculateBlurIntensity(carousel: HTMLElement) {
  const slides = carousel.querySelectorAll('.motion-carousel__slide')
  const blurSlide = slides[slides.length - 1] as HTMLElement

  if (!blurSlide)
    return

  // Get positions
  const blurSlideRect = blurSlide.getBoundingClientRect()
  const carouselRect = carousel.getBoundingClientRect()

  // Calculate how far the blur slide is from center
  const blurSlideLeft = blurSlideRect.left - carouselRect.left
  const carouselWidth = carouselRect.width
  const slideWidth = blurSlideRect.width
  const idealCenterPosition = (carouselWidth - slideWidth) / 2
  const distanceFromCenter = Math.abs(blurSlideLeft - idealCenterPosition)
  const maxDistance = carouselWidth - idealCenterPosition

  // Calculate visibility (0 to 1)
  let visibility = 0
  if (maxDistance > 0) {
    const raw = 1 - (distanceFromCenter / maxDistance)
    // Only show blur when more than 50% of slide is visible
    const delayThreshold = 0.5
    if (raw > delayThreshold) {
      visibility = (raw - delayThreshold) / (1 - delayThreshold)
    }
    visibility = Math.max(0, Math.min(1, visibility))
  }

  blurIntensity.value = visibility
}

/*
 * =============================================================================
 * LIFECYCLE HOOKS
 * =============================================================================
 */
onMounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    // Listen to scroll events (passive for better performance)
    carousel.addEventListener('scroll', handleScroll, { passive: true })
    // Calculate initial state
    handleScroll()
  }
})

onUnmounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    carousel.removeEventListener('scroll', handleScroll)
  }
})

/*
 * =============================================================================
 * USER INTERACTIONS
 * =============================================================================
 */

// Scroll to next section (project) when clicking on blur slide
function scrollToNextSection() {
  const main = document.querySelector('main')
  if (main) {
    main.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }
}

// Handle click on project title
// - If on blur slide: scroll to next project
// - Otherwise: open project popup
function handleTitleClick() {
  if (isOnBlurSlide.value) {
    scrollToNextSection()
  }
  else {
    emit('showPopup', props.projectTitle)
  }
}
</script>

<template>
  <!--
    =============================================================================
    CAROUSEL CONTAINER
    =============================================================================
    Main scrollable container that holds all slides.
    Uses CSS scroll-snap for smooth slide-by-slide scrolling.
  -->
  <div
    ref="containerRef"
    class="motion-carousel"
    data-carousel
    :style="{ backgroundImage: `url(${lastImage.src})` }"
  >
    <!-- Background layer (shows last image as fallback) -->
    <div class="motion-carousel__background" :style="{ backgroundImage: `url(${lastImage.src})` }" />

    <!--
      =============================================================================
      SLIDES CONTAINER
      =============================================================================
      Contains all slides: regular images, transparent slide, and blur slide
    -->
    <div class="motion-carousel__container">
      <!--
        Regular image slides
        - All images except the last one (last one is used for blur slide)
      -->
      <div
        v-for="(image, idx) in images.slice(0, -1)"
        :key="image.src"
        class="motion-carousel__slide motion-carousel__slide--image"
        :style="{ backgroundImage: `url(${image.src})` }"
        role="group"
        :aria-label="`Slide ${idx + 1}`"
      />

      <!--
        Transparent slide
        - Positioned before blur slide
        - Allows blur effect to show through
      -->
      <div
        class="motion-carousel__slide motion-carousel__slide--transparent"
        role="group"
        :aria-label="`Slide ${images.length}`"
        :style="{ backgroundImage: `url(${lastImage.src})` }"
      />

      <!--
        Blur slide (last slide)
        - Shows blur/darkened overlay
        - Contains chevron to go to next project
        - Clicking anywhere triggers scroll to next section
      -->
      <button
        class="motion-carousel__slide motion-carousel__slide--blur"
        aria-label="Go to next project"
        @click="scrollToNextSection"
        @keydown.down.prevent="scrollToNextSection"
      >
        <div class="blur-overlay">
          <div
            class="black-blur-div"
            :style="{
              // Background opacity increases as slide becomes more centered
              background: `rgba(0, 0, 0, ${0.25 * blurIntensity ** 2})`,
              // Blur intensity based on slide position
              backdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
              WebkitBackdropFilter: `blur(${8 * blurIntensity ** 2}px)`,
              transition: 'none',
            }"
          >
            <!-- Down chevron - fades in when blur slide is centered -->
            <div
              class="absolute bottom-5 left-1/2 z-[100] cursor-pointer hover:opacity-70 transition-opacity duration-300 pointer-events-auto"
              :style="{
                opacity: blurIntensity ** 2,
                transform: 'translateX(-50%) translateZ(0)',
                willChange: 'transform, opacity',
              }"
            >
              <UIcon name="i-lucide-chevron-down" class="size-6" />
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>

  <!--
    =============================================================================
    PROJECT TITLE OVERLAY
    =============================================================================
    Centered title that shows:
    - Project title when on regular slides
    - "NEXT PROJECT" when on blur slide
    - Hidden when either popup is open
  -->
  <div
    ref="projectTitleRef"
    class="project-title-container absolute top-1/2 left-1/2 z-[200] text-center w-full"
  >
    <button
      class="text-white motion-project-title title-font"
      :class="[{ 'motion-project-title--hidden': titleHidden }]"
      @click="handleTitleClick"
      @keydown.enter.prevent="handleTitleClick"
    >
      {{ titleText }}
    </button>
  </div>

  <!--
    =============================================================================
    PROGRESS BARS
    =============================================================================
    Visual indicator of scroll progress
    - Bottom bar: always visible when scrolled
    - Top bar: only when showTopProgressBar is true
  -->

  <!-- Bottom progress bar -->
  <div
    v-if="images.length > 1"
    class="progress-bar progress-bar--bottom absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-full px-6"
    :class="{ 'progress-bar--visible': showBottomBar }"
    :style="{ pointerEvents: currentSlide > 0 ? 'auto' : 'none' }"
  >
    <div class="h-0.5 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>
  </div>

  <!-- Top progress bar -->
  <div
    v-if="showTopBar"
    class="progress-bar progress-bar--top absolute top-5 left-1/2 -translate-x-1/2 z-20 w-full px-6"
    :class="{ 'progress-bar--visible': showBottomBar }"
    :style="{ pointerEvents: currentSlide > 0 ? 'auto' : 'none' }"
  >
    <div class="h-0.5 bg-gray-500/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div class="h-full bg-gray-50" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>
  </div>
</template>

<style scoped>
/*
 * =============================================================================
 * CAROUSEL CONTAINER
 * =============================================================================
 */
.motion-carousel {
  position: relative;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;

  /* Horizontal scrolling with snap-to-slide behavior */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.motion-carousel::-webkit-scrollbar {
  display: none;
}

/* Background layer (under slides) */
.motion-carousel__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 5;
}

/* Container for all slides */
.motion-carousel__container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  z-index: 10;
}

/*
 * =============================================================================
 * SLIDE STYLES
 * =============================================================================
 */
.motion-carousel__slide {
  position: relative;
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  min-width: 100%; /* Each slide takes full width */
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

/* Regular image slide */
.motion-carousel__slide--image {
  background-size: cover;
  background-position: center;
  background-color: black;
}

/* Transparent slide (before blur) */
.motion-carousel__slide--transparent {
  background: transparent;
  z-index: 15;
  opacity: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Blur slide (last slide with overlay) */
.motion-carousel__slide--blur {
  display: block;
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

/* Blur overlay container */
.motion-carousel__slide--blur > .blur-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Darkened blur div */
.motion-carousel__slide--blur > .blur-overlay > .black-blur-div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/*
 * =============================================================================
 * PROJECT TITLE
 * =============================================================================
 */
.motion-project-title {
  display: block;
  width: 100%;
  pointer-events: auto;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  text-align: center;
}

/* Hidden state (when popup is open) */
.motion-project-title--hidden {
  opacity: 0;
  visibility: hidden;
}

/* Title container positioning */
.project-title-container {
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/*
 * =============================================================================
 * PROGRESS BARS
 * =============================================================================
 */
.progress-bar {
  opacity: 0;
  transition:
    opacity 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

.progress-bar--visible {
  opacity: 1;
}

/* Bottom bar - slides up when visible */
.progress-bar--bottom {
  transform: translate(-50%, 10px);
}

.progress-bar--bottom.progress-bar--visible {
  transform: translate(-50%, 0);
}

/* Top bar - slides down when visible */
.progress-bar--top {
  transform: translate(-50%, -10px);
}

.progress-bar--top.progress-bar--visible {
  transform: translate(-50%, 0);
}
</style>
