<script setup lang="ts">
const props = defineProps<{
  heroImage: string
  heroTitle: string
  isAboutPopupVisible: boolean
}>()

const hasAnimatedIn = ref(false)
const hasTriggered = ref(false)
const imageScaled = ref(false)

onMounted(() => {
  if (!hasTriggered.value && !props.isAboutPopupVisible) {
    hasTriggered.value = true
    hasAnimatedIn.value = true
  }
  // Trigger scale animation after mount
  requestAnimationFrame(() => {
    imageScaled.value = true
  })
})

const { isTabletOrAbove } = useBreakpoints()

const showTitle = computed(() => !props.isAboutPopupVisible)
const titleDelay = computed(() => hasAnimatedIn.value ? '0s' : '1.2s')
const chevronSize = computed(() => isTabletOrAbove.value ? 28 : 24)
</script>

<template>
  <section
    id="hero-section"
    class="hero-section relative w-full snap-center bg-white flex items-center justify-center overflow-hidden"
  >
    <!-- Hero Background Image -->
    <div
      class="hero-background absolute inset-0 bg-cover bg-center"
      :class="{ 'hero-background--scaled': imageScaled }"
      :style="{ backgroundImage: `url(${heroImage})` }"
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
        class="absolute top-1/2 left-1/2 z-10 text-center w-full"
        :style="{
          transform: 'translate(-50%, -50%)',
          animation: `fadeInTitle 0.15s ease-out ${titleDelay} both`,
        }"
      >
        <h1
          class="text-white hero-title title-font"
        >
          {{ heroTitle }}
        </h1>
      </div>
    </Transition>

    <!-- Scroll Hint -->
    <div class="scroll-hint absolute bottom-8 z-10 text-white">
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
.hero-section {
  height: 100vh;
}

.hero-background {
  transform: scale(0.3);
  transition: transform 1.2s ease-out;
}

.hero-background--scaled {
  transform: scale(1);
}

.scroll-hint {
  left: 50%;
  margin-left: -12px;
  opacity: 1;
}

@keyframes fadeInTitle {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
