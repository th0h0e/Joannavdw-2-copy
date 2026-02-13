<script setup lang="ts">
definePageMeta({ layout: 'default' })

// Data fetching via useFetch
const [{ data: aboutRes }, { data: homepageRes }, { data: portfolioRes }, { data: settingsRes }] = await Promise.all([
  useFetch('https://admin.kontext.site/api/collections/About/records'),
  useFetch('https://admin.kontext.site/api/collections/Homepage/records'),
  useFetch('https://admin.kontext.site/api/collections/Portfolio_Projects/records'),
  useFetch('https://admin.kontext.site/api/collections/Settings/records'),
])

// Build PocketBase file URL
function getImageUrl(collectionId: string, recordId: string, filename: string) {
  return `https://admin.kontext.site/api/files/${collectionId}/${recordId}/${filename}`
}

// Single-record collections — take first active item
const aboutData = computed(() => aboutRes.value?.items?.find((i: Record<string, unknown>) => i.Is_Active) ?? null)
const homepageData = computed(() => homepageRes.value?.items?.find((i: Record<string, unknown>) => i.Is_Active) ?? null)
const settingsData = computed(() => settingsRes.value?.items?.[0] ?? null)

// Transform portfolio projects
const projectsData = computed(() => {
  const items = portfolioRes.value?.items ?? []
  return items
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.Order as number) - (b.Order as number))
    .map((project: Record<string, unknown>) => ({
      title: project.Title,
      description: project.Description,
      responsibility: project.Responsibility_json,
      images: (project.Images as string[]).map(filename => ({
        src: getImageUrl(project.collectionId, project.id, filename),
      })),
    }))
})

// Loading & error states
const loading = computed(() => !aboutRes.value && !homepageRes.value && !portfolioRes.value && !settingsRes.value)
const error = ref<string | null>(null)

// State for responsive behavior (SSR-compatible)
const { isMobile, isDesktop } = useBreakpoints()

// Update favicon dynamically via useHead()
useFaviconCache(settingsData)

// Computed
const projectTitles = computed(() => projectsData.value.map(p => p.title))
const projectCount = computed(() => projectsData.value.length)

// Simple modal state refs
const showPopup = ref(false)
const showAboutPopup = ref(false)

// Popup content data
const popupProjectTitle = ref('')
const popupProjectDescription = ref('')
const popupProjectResponsibility = ref<string[]>([])

// Popup handlers
function handleShowPopup(projectTitle: string) {
  const project = projectsData.value.find(p => p.title === projectTitle)
  popupProjectTitle.value = projectTitle
  popupProjectDescription.value = project?.description || ''
  popupProjectResponsibility.value = project?.responsibility || []
  showPopup.value = true
}

function handleClosePopup() {
  showPopup.value = false
}

function handleShowAboutPopup() {
  showAboutPopup.value = true
}

function handleCloseAboutPopup() {
  showAboutPopup.value = false
}

// Keyboard shortcuts
defineShortcuts({
  o: () => showAboutPopup.value = !showAboutPopup.value,
  p: () => showPopup.value = !showPopup.value,
})

// Carousel reset and mobile swipe hint
const { resetInactiveCarousels } = useCarouselReset(projectCount)
useMobileSwipeHint(isDesktop, projectCount)

// Section tracking
const { currentSectionIndex } = useSectionTracking(projectCount, resetInactiveCarousels)

// Edge gesture prevention
useEdgeGesturePrevention()

function handleRetry() {
  refreshNuxtData()
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
        :hero-image="homepageData ? getImageUrl(homepageData.collectionId, homepageData.id, homepageData.Hero_Image) : ''"
        :hero-title="homepageData?.Hero_Title || 'Creative Strategy and Communication'"
        :is-about-popup-visible="showAboutPopup"
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
          :total-slides="project.images.length + 1"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
      </section>

      <!-- Desktop Project Index -->
      <ProjectIndex :project-titles="projectTitles" />
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
        :hero-image="homepageData ? getImageUrl(homepageData.collectionId, homepageData.id, homepageData.Hero_Image) : ''"
        :hero-title="homepageData?.Hero_Title || 'Creative Strategy and Communication'"
        :is-about-popup-visible="showAboutPopup"
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
          :total-slides="project.images.length + 2"
          :show-top-progress-bar="true"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
      </section>

      <!-- Mobile Project Index -->
      <ProjectIndex :project-titles="projectTitles" />
    </main>

    <!-- Project Popup Modal -->
    <UModal v-model:open="showPopup" :overlay="false">
      <template #content>
        <ProjectPopup
          :project-title="popupProjectTitle"
          :project-description="popupProjectDescription"
          :project-responsibility="popupProjectResponsibility"
        />
      </template>
    </UModal>

    <!-- About Popup Modal -->
    <UModal v-model:open="showAboutPopup" :overlay="false">
      <template #content>
        <AboutPopup :about-data="aboutData" />
      </template>
    </UModal>
  </div>
</template>
