<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { isDesktop } = useDevice()
// Each useFetch returns a response object with data, pending, error, etc.

await Promise.all([
  useFetch('https://admin.kontext.site/api/collections/About/records', { key: 'about' }),
  useFetch('https://admin.kontext.site/api/collections/Homepage/records', { key: 'homepage' }),
  useFetch('https://admin.kontext.site/api/collections/Portfolio_Projects/records', { key: 'portfolio' }),
  useFetch('https://admin.kontext.site/api/collections/Settings/records', { key: 'settings' }),
])

// Portfolio projects (transformed from cached API data)
const { projects: projectsData } = usePortfolioProjects()

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

// Content ref - store the selected project title for the popup
const popupProjectTitle = ref('')

/*
 * =============================================================================
 * MODAL HANDLERS
 * =============================================================================
 * Functions to open/close modals
 */

// Open project popup - just set the title, component fetches its own data
function handleShowPopup(projectTitle: string) {
  popupProjectTitle.value = projectTitle
  showPopup.value = true
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
</script>

<template>
  <!-- MAIN CONTENT: The actual portfolio page content -->
  <div class="contents">
    <!-- FIXED LOGOS: Top and bottom logos -->
    <LogoTop
      :is-hero="currentSectionIndex === 0"
      :show-about-popup="showAboutPopup"
      :show-popup="showPopup"
      @click="showAboutPopup = true"
    />
    <LogoBottom
      :is-hero="currentSectionIndex === 0"
      :show-about-popup="showAboutPopup"
      :show-popup="showPopup"
      @click="showAboutPopup = true"
    />

    <!-- HAMBURGER MENU -->
    <LazyHamburgerMenu
      :project-titles="projectTitles"
      :is-popup-visible="showPopup || showAboutPopup"
    />

    <main
      class="overflow-y-scroll snap-y snap-mandatory"
      :style="{
        height: '100lvh',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
      }"
    >
      <!-- Hero Section -->
      <DesktopHero v-if="$device.isDesktop || $device.isTablet" :is-about-popup-visible="showAboutPopup" />
      <HeroMobile v-else :is-about-popup-visible="showAboutPopup" />

      <!-- Project Sections -->
      <section
        v-for="(project, index) in projectsData"
        :id="`project-${index}`"
        :key="project.title"
        class="relative w-full snap-center"
        style="height: 100lvh"
      >
        <MotionCarouselDesktop
          v-if="$device.isDesktop || $device.isTablet"
          :images="project.images"
          :project-title="project.title"
          :total-slides="project.images.length + 1"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
        <MotionCarousel
          v-else
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
        <ProjectPopup :project-title="popupProjectTitle" />
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
