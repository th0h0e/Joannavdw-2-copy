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
  totalSlides: number // Total number of slides (images + blur slide)
  isPopupVisible?: boolean // Whether project popup is open (for hiding title)
  isAboutPopupVisible?: boolean // Whether about popup is open (for hiding title)
}>(), {
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
const projectTitleRef = useTemplateRef('projectTitleRef') // Reference to project title element
const scrollProgress = ref(0) // Current scroll progress (0 to 1)
const currentSlide = ref(0) // Current slide index (0-based)
const isOnBlurSlide = ref(false) // Whether user is on the blur slide (last slide)

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

// Show right chevron when there are more slides to navigate to
const showRightChevron = computed(() =>
  props.images.length > 1
  && currentSlide.value < props.images.length - 1,
)

/*
 * =============================================================================
 * SCROLL HANDLING
 * =============================================================================
 * Tracks scroll position and calculates current slide index.
 * Desktop version uses half-width calculation since 2 slides fit on screen.
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

  // Desktop: each "slide" is 50vw, so we calculate based on half-width
  const halfWidth = containerWidth * 0.5

  // Check if user has scrolled to the end (blur slide)
  if (scrollLeft >= maxScroll - 5) {
    currentSlide.value = props.totalSlides - 1
    isOnBlurSlide.value = true
  }
  else {
    // Calculate current slide based on scroll position
    const slideIndex = Math.round(scrollLeft / halfWidth)
    const actualSlide = Math.min(slideIndex, props.images.length - 1)
    currentSlide.value = actualSlide
    isOnBlurSlide.value = false
  }
}

/*
 * =============================================================================
 * KEYBOARD NAVIGATION
 * =============================================================================
 * Allows users to navigate with left/right arrow keys
 */
function handleKeyDown(e: KeyboardEvent) {
  const carousel = containerRef.value
  if (!carousel)
    return

  const containerWidth = carousel.offsetWidth
  const halfWidth = containerWidth * 0.5

  // Right arrow: go to next slide
  if (e.key === 'ArrowRight' && currentSlide.value < props.totalSlides - 1) {
    e.preventDefault()
    const nextSlideIndex = currentSlide.value + 1
    carousel.scrollTo({ left: nextSlideIndex * halfWidth, behavior: 'smooth' })
  }
  // Left arrow: go to previous slide
  else if (e.key === 'ArrowLeft' && currentSlide.value > 0) {
    e.preventDefault()
    const prevSlideIndex = currentSlide.value - 1
    carousel.scrollTo({ left: prevSlideIndex * halfWidth, behavior: 'smooth' })
  }
}

/*
 * =============================================================================
 * LIFECYCLE HOOKS
 * =============================================================================
 */
onMounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    // Listen to scroll events
    carousel.addEventListener('scroll', handleScroll, { passive: true })
    // Calculate initial state
    handleScroll()
  }
  // Listen to keyboard events for navigation
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  const carousel = containerRef.value
  if (carousel) {
    carousel.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('keydown', handleKeyDown)
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

// Navigate to next slide (via right chevron button)
function handleNextSlide() {
  const carousel = containerRef.value
  if (!carousel)
    return

  const containerWidth = carousel.offsetWidth
  const halfWidth = containerWidth * 0.5
  const nextSlideIndex = currentSlide.value + 1
  carousel.scrollTo({ left: nextSlideIndex * halfWidth, behavior: 'smooth' })
}
</script>

<template>
  <!--
    =============================================================================
    CAROUSEL CONTAINER
    =============================================================================
    Main scrollable container that holds all slides.
    On desktop, each slide is 50vw wide (showing 2 slides at a time).
    Uses CSS scroll-snap for smooth slide-by-slide scrolling.
  -->
  <div
    ref="containerRef"
    class="motion-carousel-desktop"
    data-carousel
    :style="{ backgroundImage: `url(${lastImage.src})` }"
  >
    <!-- Background layer -->
    <div class="motion-carousel-desktop__background" :style="{ backgroundImage: `url(${lastImage.src})` }" />

    <!--
      =============================================================================
      SLIDES CONTAINER
      =============================================================================
      Contains all slides: regular images + blur slide
    -->
    <div class="motion-carousel-desktop__container">
      <!-- Regular image slides (each 50vw wide) -->
      <div
        v-for="(image, idx) in images"
        :key="image.src"
        class="motion-carousel-desktop__slide"
        :style="{ backgroundImage: `url(${image.src})` }"
        role="group"
        :aria-label="`Slide ${idx + 1}`"
      />

      <!--
        Blur slide (last slide)
        - Full viewport width (100vw)
        - Shows darkened blur overlay
        - Clicking triggers scroll to next project
      -->
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
      class="text-white motion-project-title-desktop title-font"
      :class="[
        { 'motion-project-title-desktop--hidden': titleHidden },
      ]"
      @click="handleTitleClick"
      @keydown.enter.prevent="handleTitleClick"
    >
      {{ titleText }}
    </button>
  </div>

  <!--
    =============================================================================
    PROGRESS BAR
    =============================================================================
    Shows scroll progress. Only visible when:
    - Not on first slide AND
    - Not on blur slide
  -->
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

  <!--
    =============================================================================
    DOWN CHEVRON
    =============================================================================
    Appears on the blur slide to indicate user can go to next project.
    Only visible when on blur slide.
  -->
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
      <UIcon name="i-lucide-chevron-down" class="size-6 hover:opacity-70 transition-opacity duration-300" />
    </button>
  </div>

  <!--
    =============================================================================
    RIGHT CHEVRON
    =============================================================================
    Navigate to next slide.
    Only visible when there are more slides to show.
  -->
  <button
    v-if="showRightChevron"
    class="right-chevron absolute right-6 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer z-[250] transition-opacity duration-150 hover:opacity-70"
    aria-label="Next slide"
    @click="handleNextSlide"
  >
    <UIcon name="i-lucide-chevron-right" class="size-6 pointer-events-none" />
  </button>
</template>

<style scoped>
/*
 * =============================================================================
 * CAROUSEL CONTAINER
 * =============================================================================
 */
.motion-carousel-desktop {
  position: relative;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;

  /* Horizontal scrolling with snap-to-slide */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-align: none;
}

.motion-carousel-desktop::-webkit-scrollbar {
  display: none;
}

/* Background layer */
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

/* Container for all slides */
.motion-carousel-desktop__container {
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
.motion-carousel-desktop__slide {
  position: relative;
  height: 100%;
  flex-shrink: 0;
  min-width: 50vw; /* Desktop shows 2 slides at a time */
  width: 50vw;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  background-size: cover;
  background-position: center;
  background-color: black;
}

/* Blur slide (full width) */
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

/* Blur overlay */
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

/*
 * =============================================================================
 * PROJECT TITLE
 * =============================================================================
 */
.motion-project-title-desktop {
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

/* Hidden state */
.motion-project-title-desktop--hidden {
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
 * PROGRESS BAR
 * =============================================================================
 */
.progress-bar-wrapper {
  transform: translate(-50%, 0) translateZ(0);
  will-change: transform;
}

.progress-bar-inner {
  width: 100%;
  opacity: 0;
  transform: translateY(10px) translateZ(0);
  transition:
    opacity 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

.progress-bar-inner--visible {
  opacity: 1;
  transform: translateY(0) translateZ(0);
}

/*
 * =============================================================================
 * CHEVRONS
 * =============================================================================
 */

/* Down chevron (for next project) */
.chevron-down-wrapper {
  transform: translate(-50%, 0) translateZ(0);
  will-change: transform;
}

.chevron-down-inner {
  display: block;
  opacity: 0;
  transform: translateY(-10px) translateZ(0);
  transition:
    opacity 0.15s ease-in-out,
    transform 0.15s ease-in-out;
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

/* Right chevron (for next slide) */
.right-chevron {
  opacity: 1;
}
</style>
