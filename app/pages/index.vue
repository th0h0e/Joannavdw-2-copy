<script setup lang="ts">
/*
 * =============================================================================
 * PAGE CONFIGURATION
 * =============================================================================
 */
// Use the default layout (defined in app/layouts/default.vue)
definePageMeta({ layout: 'default' })

/*
 * =============================================================================
 * DATA FETCHING
 * =============================================================================
 * Fetch all data from PocketBase API in parallel for better performance.
 * Each useFetch returns a response object with data, pending, error, etc.
 */
await Promise.all([
  useFetch('https://admin.kontext.site/api/collections/About/records', { key: 'about' }),
  useFetch('https://admin.kontext.site/api/collections/Homepage/records', { key: 'homepage' }),
  useFetch('https://admin.kontext.site/api/collections/Portfolio_Projects/records', { key: 'portfolio' }),
  useFetch('https://admin.kontext.site/api/collections/Settings/records', { key: 'settings' }),
])

const { data: aboutRes } = useNuxtData('about')
const { data: homepageRes } = useNuxtData('homepage')
const { data: portfolioRes } = useNuxtData('portfolio')
const { data: settingsRes } = useNuxtData('settings')

/*
 * =============================================================================
 * HELPERS
 * =============================================================================
 * Builds a full URL for PocketBase file storage
 * @param collectionId - The ID of the collection
 * @param recordId - The ID of the record
 * @param filename - The filename to retrieve
 * @returns Full URL to the image file
 */
function getImageUrl(collectionId: string, recordId: string, filename: string) {
  return `https://admin.kontext.site/api/files/${collectionId}/${recordId}/${filename}`
}

/*
 * =============================================================================
 * DATA TRANSFORMATION
 * =============================================================================
 * Transform raw API responses into usable data for the component
 */

// Get the "active" item from Homepage collection filtered by Is_Active flag
const homepageData = computed(() => homepageRes.value?.items?.find((i: Record<string, unknown>) => i.Is_Active) ?? null)

// Transform portfolio projects into a clean format
// - Sort by Order field
// - Map images to full URLs using getImageUrl
const projectsData = computed(() => {
  const items = portfolioRes.value?.items ?? []
  return items
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.Order as number) - (b.Order as number))
    .map((project: Record<string, unknown>) => ({
      title: project.Title,
      description: project.Description,
      responsibility: project.Responsibility_json, // JSON-parsed array of responsibilities
      images: (project.Images as string[]).map(filename => ({
        src: getImageUrl(project.collectionId, project.id, filename),
      })),
    }))
})

/*
 * =============================================================================
 * LOADING & ERROR STATES
 * =============================================================================
 * Track loading state for showing/hiding loading indicator
 */
const loading = computed(() => !aboutRes.value && !homepageRes.value && !portfolioRes.value && !settingsRes.value)
const error = ref<string | null>(null)

/*
 * =============================================================================
 * DEVICE DETECTION
 * =============================================================================
 * useDevice provides user-agent-based isMobile/isDesktop booleans
 * Works with SSR out of the box
 */
const { isMobile, isDesktop } = useDevice()

/*
 * =============================================================================
 * COMPUTED DERIVATIVES
 * =============================================================================
 * Derived values from fetched data
 */
const projectTitles = computed(() => projectsData.value.map(p => p.title)) // Array of project titles for navigation
const projectCount = computed(() => projectsData.value.length) // Total number of projects

/*
 * =============================================================================
 * MODAL STATE
 * =============================================================================
 * Simple refs to control popup modals (no custom composable needed!)
 * Using NuxtUI's UModal with v-model:open
 */

// Visibility refs - toggled by clicking project titles or logos
const showPopup = ref(false) // Project popup (shows project details)
const showAboutPopup = ref(false) // About popup (shows about/contact info)

// Content refs - store the data to display in each popup
const popupProjectTitle = ref('') // Current project title
const popupProjectDescription = ref('') // Current project description
const popupProjectResponsibility = ref<string[]>([]) // Current project responsibilities

/*
 * =============================================================================
 * MODAL HANDLERS
 * =============================================================================
 * Functions to open/close modals
 */

// Open project popup - find project data and set content
function handleShowPopup(projectTitle: string) {
  const project = projectsData.value.find(p => p.title === projectTitle)
  popupProjectTitle.value = projectTitle
  popupProjectDescription.value = project?.description || ''
  popupProjectResponsibility.value = project?.responsibility || []
  showPopup.value = true
}

// Close project popup
function handleClosePopup() {
  showPopup.value = false
}

// Open about popup (clicking logos)
function handleShowAboutPopup() {
  showAboutPopup.value = true
}

// Close about popup
function handleCloseAboutPopup() {
  showAboutPopup.value = false
}

/*
 * =============================================================================
 * KEYBOARD SHORTCUTS
 * =============================================================================
 * NuxtUI's defineShortcuts for keyboard-driven interactions
 *
 * - Press 'O' to toggle About popup
 * - Press 'P' to toggle Project popup
 */
defineShortcuts({
  o: () => showAboutPopup.value = !showAboutPopup.value,
  p: () => showPopup.value = !showPopup.value,
})

/*
 * =============================================================================
 * CAROUSEL STATE MANAGEMENT
 * =============================================================================
 * Composables for managing carousel behavior across the page
 */

// Reset inactive carousels when switching sections
const { resetInactiveCarousels } = useCarouselReset(projectCount)

// Show swipe hint on mobile devices
useMobileSwipeHint(isDesktop, projectCount)

/*
 * =============================================================================
 * SECTION TRACKING
 * =============================================================================
 * Track which project section is currently visible
 * Used to determine hero state for logos
 */
const { currentSectionIndex } = useSectionTracking(projectCount, resetInactiveCarousels)

/*
 * =============================================================================
 * GESTURE PREVENTION
 * =============================================================================
 * Prevent edge gestures (like swipe-back) that could interfere with navigation
 */
useEdgeGesturePrevention()

/*
 * =============================================================================
 * ERROR HANDLING
 * =============================================================================
 * Retry function for error state
 */
function handleRetry() {
  refreshNuxtData()
}
</script>

<template>
  <!-- LOADING STATE: Shown while data is being fetched -->
  <div v-if="loading" class="h-dvh w-full flex items-center justify-center">
    <div class="text-center">
      <div class="text-xl mb-4">
        Loading Portfolio...
      </div>
    </div>
  </div>

  <!-- ERROR STATE: Shown if data fetching fails -->
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

  <!-- MAIN CONTENT: The actual portfolio page content -->
  <div v-else class="contents">
    <!-- FIXED LOGOS: Top and bottom logos -->
    <LogoTop
      :is-hero="currentSectionIndex === 0"
      :show-about-popup="showAboutPopup"
      :show-popup="showPopup"
      @click="handleShowAboutPopup"
    />
    <LogoBottom
      :is-hero="currentSectionIndex === 0"
      :show-about-popup="showAboutPopup"
      :show-popup="showPopup"
      @click="handleShowAboutPopup"
    />

    <!-- HAMBURGER MENU -->
    <LazyHamburgerMenu
      :project-titles="projectTitles"
      :is-popup-visible="showPopup || showAboutPopup"
    />

    <!-- DESKTOP LAYOUT: MotionCarouselDesktop (shows 2 slides at a time) -->
    <main
      v-if="isDesktop"
      class="overflow-y-scroll snap-y snap-mandatory"
      :style="{
        height: '100lvh',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
      }"
    >
      <!-- Hero Section -->
      <Hero
        :hero-image="homepageData ? getImageUrl(homepageData.collectionId, homepageData.id, homepageData.Hero_Image) : ''"
        :hero-title="homepageData?.Hero_Title || 'Creative Strategy and Communication'"
        :is-about-popup-visible="showAboutPopup"
      />

      <!-- Project Sections -->
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
          :total-slides="project.images.length + 1"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
      </section>

      <!-- Project Index -->
      <ProjectIndex />
    </main>

    <!-- MOBILE LAYOUT: MotionCarousel (full-width slides) -->
    <main
      v-else
      class="overflow-y-scroll snap-y snap-mandatory"
      :style="{
        height: '100lvh',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
      }"
    >
      <!-- Hero Section -->
      <HeroMobile
        :hero-image="homepageData ? getImageUrl(homepageData.collectionId, homepageData.id, homepageData.Hero_Image) : ''"
        :hero-title="homepageData?.Hero_Title || 'Creative Strategy and Communication'"
        :is-about-popup-visible="showAboutPopup"
      />

      <!-- Project Sections -->
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
          :total-slides="project.images.length + 2"
          :show-top-progress-bar="true"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
      </section>

      <!-- Project Index -->
      <ProjectIndex />
    </main>

    <!-- POPUP MODALS: NuxtUI UModal with custom content -->

    <!-- Project Details Popup -->
    <UModal v-model:open="showPopup" :overlay="false">
      <template #content>
        <ProjectPopup
          :project-title="popupProjectTitle"
          :project-description="popupProjectDescription"
          :project-responsibility="popupProjectResponsibility"
        />
      </template>
    </UModal>

    <!-- About/Contact Popup -->
    <UModal v-model:open="showAboutPopup" :overlay="false">
      <template #content>
        <AboutPopup />
      </template>
    </UModal>
  </div>
</template>
