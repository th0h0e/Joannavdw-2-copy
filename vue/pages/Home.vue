<script setup lang="ts">
import type { About, Homepage, PortfolioProject, Settings } from '@/plugins/pocketbase'
import { useEventListener } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AboutPopup from '@/components/AboutPopup.vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import Hero from '@/components/Hero.vue'
import HeroMobile from '@/components/HeroMobile.vue'
import LogoBottom from '@/components/LogoBottom.vue'
import LogoTop from '@/components/LogoTop.vue'
import MotionCarousel from '@/components/MotionCarousel.vue'
import MotionCarouselDesktop from '@/components/MotionCarouselDesktop.vue'
import ProjectIndex from '@/components/ProjectIndex.vue'
import ProjectPopup from '@/components/ProjectPopup.vue'
import pb, { getCachedData, getImageUrl, setCachedData } from '@/plugins/pocketbase'

// Type for converted project data used in the app
interface ConvertedProject {
  title: string
  description: string
  images: { src: string }[]
  responsibility?: string[]
}

// Convert PocketBase project to expected format
function convertPocketBaseProject(project: PortfolioProject): ConvertedProject {
  return {
    title: project.Title,
    description: project.Description,
    images: project.Images.map(filename => ({
      src: getImageUrl(project, filename),
    })),
    responsibility: project.Responsibility_json || project.Responsibility,
  }
}

// State for PocketBase data
const projectsData = ref<ConvertedProject[]>([])
const homepageData = ref<Homepage | null>(null)
const aboutData = ref<About | null>(null)
const settingsData = ref<Settings | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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

// State for responsive behavior
const isMobile = ref(window.innerWidth < 768)
const isDesktop = ref(window.innerWidth >= 1024)

// Update responsive states on resize
useEventListener(window, 'resize', () => {
  isMobile.value = window.innerWidth < 768
  isDesktop.value = window.innerWidth >= 1024
})

// Fetch data from PocketBase
async function fetchData() {
  try {
    loading.value = true

    const cachedProjects = getCachedData<PortfolioProject[]>('Portfolio_Projects')
    const cachedHomepage = getCachedData<Homepage[]>('Homepage')
    const cachedAbout = getCachedData<About[]>('About')
    const cachedSettings = getCachedData<Settings[]>('Settings')

    if (cachedProjects && cachedHomepage && cachedAbout && cachedSettings) {
      projectsData.value = cachedProjects.map(convertPocketBaseProject)
      homepageData.value = cachedHomepage[0] || null
      aboutData.value = cachedAbout[0] || null
      settingsData.value = cachedSettings[0] || null
      error.value = null
      loading.value = false
      return
    }

    const [projectsResponse, homepageResponse, aboutResponse, settingsResponse] = await Promise.all([
      pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order' }),
      pb.collection('Homepage').getFullList<Homepage>({ filter: 'Is_Active = true', sort: '-created' }),
      pb.collection('About').getFullList<About>({ filter: 'Is_Active = true', sort: '-created' }),
      pb.collection('Settings').getFullList<Settings>({ sort: '-created' }),
    ])

    setCachedData('Portfolio_Projects', projectsResponse)
    setCachedData('Homepage', homepageResponse)
    setCachedData('About', aboutResponse)
    setCachedData('Settings', settingsResponse)

    projectsData.value = projectsResponse.map(convertPocketBaseProject)
    homepageData.value = homepageResponse[0] || null
    aboutData.value = aboutResponse[0] || null
    settingsData.value = settingsResponse[0] || null
    error.value = null
  }
  catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to load data'
  }
  finally {
    loading.value = false
  }
}

// Set up realtime subscriptions
function setupSubscriptions() {
  pb.collection('Portfolio_Projects').subscribe('*', async () => {
    const freshProjects = await pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order' })
    setCachedData('Portfolio_Projects', freshProjects)
    projectsData.value = freshProjects.map(convertPocketBaseProject)
  })

  pb.collection('Homepage').subscribe('*', async () => {
    const freshHomepage = await pb.collection('Homepage').getFullList<Homepage>({ filter: 'Is_Active = true', sort: '-created' })
    setCachedData('Homepage', freshHomepage)
    homepageData.value = freshHomepage[0] || null
  })

  pb.collection('About').subscribe('*', async () => {
    const freshAbout = await pb.collection('About').getFullList<About>({ filter: 'Is_Active = true', sort: '-created' })
    setCachedData('About', freshAbout)
    aboutData.value = freshAbout[0] || null
  })

  pb.collection('Settings').subscribe('*', async () => {
    const freshSettings = await pb.collection('Settings').getFullList<Settings>({ sort: '-created' })
    setCachedData('Settings', freshSettings)
    settingsData.value = freshSettings[0] || null
  })
}

// Update favicon dynamically
watch(settingsData, (settings) => {
  if (settings && settings.favicon) {
    const faviconUrl = getImageUrl(settings, settings.favicon)
    const cacheKey = 'favicon_cache'
    const versionKey = 'favicon_version'
    const cachedVersion = localStorage.getItem(versionKey)
    const cachedFavicon = localStorage.getItem(cacheKey)

    const updateFavicon = (dataUrl: string) => {
      const existingLinks = document.querySelectorAll('link[rel="icon"]')
      existingLinks.forEach(link => link.remove())
      const faviconLink = document.createElement('link')
      faviconLink.rel = 'icon'
      faviconLink.type = 'image/png'
      faviconLink.href = dataUrl
      document.head.appendChild(faviconLink)
    }

    if (cachedVersion === settings.updated && cachedFavicon) {
      updateFavicon(cachedFavicon)
    }
    else {
      fetch(faviconUrl)
        .then(response => response.blob())
        .then((blob) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const dataUrl = reader.result as string
            try {
              localStorage.setItem(cacheKey, dataUrl)
              localStorage.setItem(versionKey, settings.updated)
            }
            catch (e) {
              console.warn('Failed to cache favicon:', e)
            }
            updateFavicon(dataUrl)
          }
          reader.readAsDataURL(blob)
        })
        .catch((e) => {
          console.warn('Failed to load favicon:', e)
          updateFavicon(`${faviconUrl}?v=${settings.updated}`)
        })
    }
  }
})

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
  if (window.innerWidth >= 1024 || hasShownMobileHint.value || projectsData.value.length === 0)
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

            const firstSlide = slides[0]
            const secondSlide = slides[1]

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

onMounted(async () => {
  await fetchData()
  setupSubscriptions()
  hideAddressBar()

  window.addEventListener('orientationchange', () => setTimeout(hideAddressBar, 100))
})

onUnmounted(() => {
  if (observer)
    observer.disconnect()
  pb.collection('Portfolio_Projects').unsubscribe()
  pb.collection('Homepage').unsubscribe()
  pb.collection('About').unsubscribe()
  pb.collection('Settings').unsubscribe()
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
  <template v-else>
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
    <HamburgerMenu
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
    <ProjectPopup
      :is-visible="showPopup"
      :project-title="popupProjectTitle"
      :project-description="popupProjectDescription"
      :project-responsibility="popupProjectResponsibility"
      @close="handleClosePopup"
    />

    <!-- About Popup -->
    <AboutPopup
      :is-visible="showAboutPopup"
      :about-data="aboutData"
      @close="handleCloseAboutPopup"
    />
  </template>
</template>
