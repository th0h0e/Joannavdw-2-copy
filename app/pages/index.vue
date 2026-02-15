<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { projects: projectsData } = usePortfolioProjects()
const { heroImage: _heroImage, heroTitle: _heroTitle } = useHomepageData()
const { aboutData: _aboutData } = useAboutData()

const projectCount = computed(() => projectsData.value.length)

const showPopup = ref(false)
const showAboutPopup = ref(false)
const popupProjectTitle = ref('')

function handleShowPopup(projectTitle: string) {
  popupProjectTitle.value = projectTitle
  showPopup.value = true
}

function closePopups() {
  showPopup.value = false
  showAboutPopup.value = false
}

defineShortcuts({
  o: () => showAboutPopup.value = !showAboutPopup.value,
  p: () => showPopup.value = !showPopup.value,
  escape: () => closePopups(),
})

const { resetInactiveCarousels } = useCarouselReset(projectCount)

useMobileSwipeHint(projectCount)

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
      class="snap-y snap-mandatory overflow-y-scroll"
      :style="{
        height: '100lvh',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
      }"
    >
      <HeroSection :is-about-popup-visible="showAboutPopup" />

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
          :total-slides="$device.isMobile ? project.images.length + 2 : project.images.length + 1"
          :show-top-progress-bar="$device.isMobile"
          :is-popup-visible="showPopup"
          :is-about-popup-visible="showAboutPopup"
          @show-popup="handleShowPopup"
        />
      </section>

      <ProjectIndex />
    </main>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showPopup"
          class="fixed inset-0 z-9998"
          role="button"
          tabindex="-1"
          aria-label="Close popup"
          @click="closePopups"
          @keydown.enter="closePopups"
          @keydown.space="closePopups"
        />
      </Transition>

      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showAboutPopup"
          class="popup-backdrop fixed inset-0 z-9998"
          role="button"
          tabindex="-1"
          aria-label="Close popup"
          @click="closePopups"
          @keydown.enter="closePopups"
          @keydown.space="closePopups"
        />
      </Transition>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-90"
        leave-to-class="opacity-0 scale-90"
      >
        <ProjectPopup
          v-if="showPopup"
          class="relative z-9999"
          :project-title="popupProjectTitle"
          @click.stop
        />
      </Transition>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-90"
        leave-to-class="opacity-0 scale-90"
      >
        <AboutPopup
          v-if="showAboutPopup"
          class="relative z-9999"
          @click.stop
        />
      </Transition>
    </Teleport>
  </div>
</template>
