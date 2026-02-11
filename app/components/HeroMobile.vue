<script setup lang="ts">

const props = defineProps<{
  heroImage: string
  heroTitle: string
  isAboutPopupVisible: boolean
  isMobile?: boolean
}>()

const fontSizes = {
  mobile: 1.4,
  tablet: 2.5,
  desktop: 2.25,
  largeDesktop: 3,
}
const hasAnimatedIn = ref(false)
const hasTriggered = ref(false)
const imageScaled = ref(false)

useHead({
  style: [
    {
      innerHTML: `
        .hero-title {
          font-size: ${fontSizes.mobile}rem;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: ${fontSizes.tablet}rem;
          }
        }
        @media (min-width: 1024px) {
          .hero-title {
            font-size: ${fontSizes.desktop}rem;
          }
        }
        @media (min-width: 1280px) {
          .hero-title {
            font-size: ${fontSizes.largeDesktop}rem;
          }
        }
      `,
    },
  ],
})

onMounted(() => {
  if (!hasTriggered.value && !props.isAboutPopupVisible) {
    hasTriggered.value = true
    hasAnimatedIn.value = true
  }
  requestAnimationFrame(() => {
    imageScaled.value = true
  })
})

const { isTabletOrAbove } = useBreakpoints()

const showTitle = computed(() => !props.isAboutPopupVisible)
const titleDelay = computed(() => hasAnimatedIn.value ? '0s' : '1.2s')
const sectionHeight = computed(() => props.isMobile !== false ? '100lvh' : '100vh')
const chevronSize = computed(() => isTabletOrAbove.value ? 28 : 24)
</script>

<template>
  <section
    id="hero-section"
    class="relative w-full snap-center bg-white flex items-center justify-center overflow-hidden"
    :style="{ height: sectionHeight }"
  >
    <!-- Hero Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{
        backgroundImage: `url(${heroImage})`,
        transform: imageScaled ? 'scale(1)' : 'scale(0.3)',
        transition: 'transform 1.2s ease-out',
      }"
    />

    <!-- Hero Headline -->
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTitle"
        :class="`absolute top-1/2 left-1/2 z-10 text-center w-full ${projectTitleContainerClasses}`"
        :style="{
          transform: 'translate(-50%, -50%)',
          animation: `fadeInTitle 0.15s ease-out ${titleDelay} both`,
        }"
      >
        <h1
          :class="`text-white ${projectTitleClasses} hero-title`"
          :style="{
            fontFamily: 'EnduroWeb, sans-serif',
            letterSpacing: '0.03em',
          }"
        >
          {{ heroTitle }}
        </h1>
      </div>
    </Transition>

    <!-- Scroll Hint -->
    <div
      class="absolute bottom-8 z-10 text-white"
      :style="{ left: '50%', marginLeft: '-12px', opacity: 1 }"
    >
      <ChevronDown
        :width="chevronSize"
        :height="chevronSize"
        color="white"
        class="drop-shadow-2xl"
      />
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeInTitle {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
