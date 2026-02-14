<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { isDesktop } = useDevice()

await Promise.all([
  useFetch('https://admin.kontext.site/api/collections/About/records', { key: 'about' }),
  useFetch('https://admin.kontext.site/api/collections/Homepage/records', { key: 'homepage' }),
  useFetch('https://admin.kontext.site/api/collections/Portfolio_Projects/records', { key: 'portfolio' }),
])

const { projects: projectsData } = usePortfolioProjects()

const projectCount = computed(() => projectsData.value.length)

const showPopup = ref(false)
const showAboutPopup = ref(false)
const popupProjectTitle = ref('')

function handleShowPopup(projectTitle: string) {
  popupProjectTitle.value = projectTitle
  showPopup.value = true
}

defineShortcuts({
  o: () => showAboutPopup.value = !showAboutPopup.value,
  p: () => showPopup.value = !showPopup.value,
})

const { resetInactiveCarousels } = useCarouselReset(projectCount)

useMobileSwipeHint(isDesktop, projectCount)

const { currentSectionIndex } = useSectionTracking(projectCount, resetInactiveCarousels)

useEdgeGesturePrevention()
</script>

<template>
  <div class="contents">
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

    <LazyHamburgerMenu
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
      <DesktopHero v-if="$device.isDesktop || $device.isTablet" :is-about-popup-visible="showAboutPopup" />
      <HeroMobile v-else :is-about-popup-visible="showAboutPopup" />

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

      <ProjectIndex />
    </main>

    <UModal v-model:open="showPopup" :overlay="false">
      <template #content>
        <ProjectPopup :project-title="popupProjectTitle" />
      </template>
    </UModal>

    <UModal v-model:open="showAboutPopup" :overlay="false">
      <template #content>
        <AboutPopup />
      </template>
    </UModal>
  </div>
</template>
