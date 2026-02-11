<script setup lang="ts">
import { getImageUrl } from '~/plugins/pocketbase.client'

// Data fetching via composable (useAsyncData + realtime subscriptions)
const { projects: projectsData, homepage: homepageData, about: aboutData, settings: settingsData, loading, error, setupSubscriptions } = usePocketBase()

// State for tracking current section
const currentSectionIndex = ref(0)

// State for popup
const showPopup = ref(false)
const popupProjectTitle = ref('')
const popupProjectDescription = ref('')
const popupProjectResponsibility = ref<string[]>([])

// State for about popup
const showAboutPopup = ref(false)
const canOpenAboutPopup = ref(true)

// Mobile swipe hint state
const hasShownMobileHint = ref(false)

// State for responsive behavior (SSR-compatible)
const { isMobile, isDesktop } = useBreakpoints()

// Update favicon dynamically via useHead()
useFaviconCache(settingsData)

// Reset inactive project carousels
function resetInactiveCarousels(currentSectionId: string) {
  setTimeout(() => {
    projectsData.value.forEach((_, index) => {
      const sectionId = `project-${index}`
      if (sectionId === currentSectionId)
        return
      const section = document.getElementById(sectionId)
      if (!section)
        return
      const carousel = section.querySelector('.motion-carousel, .motion-carousel-desktop') as HTMLElement
      if (!carousel)
        return
      carousel.scrollLeft = 0
    })
  }, 300)
}

// Section tracking with IntersectionObserver
let observer: IntersectionObserver | null = null

function setupSectionTracking() {
  if (observer)
    observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id
          let index: number | undefined

          if (sectionId === 'hero-section') {
            index = 0
          }
          else if (sectionId.startsWith('project-')) {
            index = Number.parseInt(sectionId.replace('project-', '')) + 1
          }
          else if (sectionId === 'project-index') {
            index = projectsData.value.length + 1
          }

          if (index !== undefined) {
            currentSectionIndex.value = index
            if (sectionId.startsWith('project-') || sectionId === 'hero-section' || sectionId === 'project-index') {
              resetInactiveCarousels(sectionId)
            }
          }
        }
      })
    },
    { threshold: 0.5, root: document.querySelector('main') },
  )

  const heroSection = document.getElementById('hero-section')
  if (heroSection)
    observer.observe(heroSection)

  projectsData.value.forEach((_, index) => {
    const section = document.getElementById(`project-${index}`)
    if (section)
      observer!.observe(section)
  })

  const indexSection = document.getElementById('project-index')
  if (indexSection)
    observer.observe(indexSection)
}

// Watch for projectsData changes to re-setup section tracking
watch(projectsData, () => {
  nextTick(() => setupSectionTracking())
})

// Edge gesture prevention
useEventListener(document, 'touchstart', (e: TouchEvent) => {
  const touch = e.touches[0]
  if (touch && touch.clientX < 50) {
    const carousel = (e.target as Element)?.closest('[data-carousel]')
    if (!carousel) {
      e.preventDefault()
    }
  }
}, { passive: false })

// Hide address bar for immersive experience
function hideAddressBar() {
  setTimeout(() => {
    window.scrollTo(0, 1)
    setTimeout(() => window.scrollTo(0, 0), 0)
  }, 100)
}

// Mobile swipe hint
function setupMobileSwipeHint() {
  if (isDesktop.value || hasShownMobileHint.value || projectsData.value.length === 0)
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

watch(() => projectsData.value.length, () => {
  nextTick(() => setupMobileSwipeHint())
})

onMounted(() => {
  setupSubscriptions()
  hideAddressBar()

  window.addEventListener('orientationchange', () => setTimeout(hideAddressBar, 100))
})

onUnmounted(() => {
  if (observer)
    observer.disconnect()
})

// Computed
const projectTitles = computed(() => projectsData.value.map(p => p.title))

// Popup handlers
function handleShowPopup(projectTitle: string) {
  const project = projectsData.value.find(p => p.title === projectTitle)
  popupProjectTitle.value = projectTitle
  popupProjectDescription.value = project?.description || ''
  popupProjectResponsibility.value = project?.responsibility || []
  showAboutPopup.value = false
  showPopup.value = true
}

function handleClosePopup() {
  showPopup.value = false
  canOpenAboutPopup.value = false
  setTimeout(() => {
    canOpenAboutPopup.value = true
  }, 100)
}

function handleShowAboutPopup() {
  if (showPopup.value || !canOpenAboutPopup.value)
    return
  showPopup.value = false
  showAboutPopup.value = true
}

function handleCloseAboutPopup() {
  showAboutPopup.value = false
}

function handleRetry() {
  window.location.reload()
}
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="h-dvh w-full flex items-center justify-center">
    <div class="text-center">
      <div class="text-xl mb-4">
        Loading Portfolio...
      </div>
    </div>
  </div>

  <!-- Error state -->
  <div v-else-if="error" class="h-dvh w-full flex items-center justify-center">
    <div class="text-center text-red-500">
      <div class="text-xl mb-4">
        Error: {{ error }}
      </div>
      <button
        class="px-4 py-2 bg-gray-200 text-black rounded"
        @click="handleRetry"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Main content -->
  <div v-else class="contents">
    <!-- Fixed Logo Containers -->
    <LogoTop
      :is-hero="currentSectionIndex === 0"
      :show-about-popup="showAboutPopup"
      :show-popup="showPopup"
      :is-mobile="isMobile"
      @click="handleShowAboutPopup"
    />
    <LogoBottom
      :is-hero="currentSectionIndex === 0"
      :show-about-popup="showAboutPopup"
      :show-popup="showPopup"
      :is-mobile="isMobile"
      @click="handleShowAboutPopup"
    />

    <!-- Hamburger Menu -->
    <LazyHamburgerMenu
      :project-titles="projectTitles"
      :is-popup-visible="showPopup || showAboutPopup"
      :settings-data="settingsData"
    />

    <!-- Desktop Main Container -->
    <main
      v-if="isDesktop"
      class="overflow-y-scroll snap-y snap-mandatory"
      :style="{
        height: '100lvh',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
      }"
    >
      <!-- Desktop Hero Section -->
      <Hero
        :hero-image="homepageData ? getImageUrl(homepageData, homepageData.Hero_Image) : ''"
        :hero-title="homepageData?.Hero_Title || 'Creative Strategy and Communication'"
        :is-about-popup-visible="showAboutPopup"
        :settings-data="settingsData"
      />

      <!-- Desktop Project Sections -->
      <section
        v-for="(project, index) in projectsData"
        :id="`project-${index}`"
        :key="project.title"
        class="relative w-full snap-center"
        style="height: 100lvh"
      >
        <MotionCarouselDesktop
          :images="project.images"
          :project-title="project.title"
          :settings-data="settingsData"
          :total-slides="project.images.length + 1"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
      </section>

      <!-- Desktop Project Index -->
      <ProjectIndex :project-titles="projectTitles" :settings-data="settingsData" />
    </main>

    <!-- Mobile Main Container -->
    <main
      v-else
      class="overflow-y-scroll snap-y snap-mandatory"
      :style="{
        height: '100lvh',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
      }"
    >
      <!-- Mobile Hero Section -->
      <HeroMobile
        :hero-image="homepageData ? getImageUrl(homepageData, homepageData.Hero_Image_Mobile || homepageData.Hero_Image) : ''"
        :hero-title="homepageData?.Hero_Title || 'Creative Strategy and Communication'"
        :is-about-popup-visible="showAboutPopup"
        :settings-data="settingsData"
        :is-mobile="isMobile"
      />

      <!-- Mobile Project Sections -->
      <section
        v-for="(project, index) in projectsData"
        :id="`project-${index}`"
        :key="project.title"
        class="relative w-full snap-center"
        style="height: 100lvh"
      >
        <MotionCarousel
          :images="project.images"
          :project-title="project.title"
          :settings-data="settingsData"
          :total-slides="project.images.length + 2"
          :show-top-progress-bar="settingsData?.Show_Top_Progress_Bar ?? true"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
      </section>

      <!-- Mobile Project Index -->
      <ProjectIndex :project-titles="projectTitles" :settings-data="settingsData" />
    </main>

    <!-- Global Popup -->
    <LazyProjectPopup
      :is-visible="showPopup"
      :project-title="popupProjectTitle"
      :project-description="popupProjectDescription"
      :project-responsibility="popupProjectResponsibility"
      @close="handleClosePopup"
    />

    <!-- About Popup -->
    <LazyAboutPopup
      :is-visible="showAboutPopup"
      :about-data="aboutData"
      @close="handleCloseAboutPopup"
    />
  </div>
</template>
