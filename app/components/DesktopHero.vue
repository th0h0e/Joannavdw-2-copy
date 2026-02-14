<script setup lang="ts">
const props = defineProps<{
  isAboutPopupVisible: boolean
}>()

const { heroImage, heroTitle } = useHomepageData()

const hasAnimatedIn = ref(false)
const hasTriggered = ref(false)
const imageScaled = ref(false)

const showTitle = computed(() => !props.isAboutPopupVisible)
const titleDelay = computed(() => hasAnimatedIn.value ? '0s' : '1.2s')

onMounted(() => {
  if (!hasTriggered.value && !props.isAboutPopupVisible) {
    hasTriggered.value = true
    hasAnimatedIn.value = true
  }
  requestAnimationFrame(() => {
    imageScaled.value = true
  })
})
</script>

<template>
  <section
    id="hero-section"
    class="relative w-full h-screen snap-center bg-white flex items-center justify-center overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out"
      :class="[imageScaled ? 'scale-100' : 'scale-[0.3]']"
      :style="{ backgroundImage: `url(${heroImage})` }"
    />

    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTitle"
        class="absolute top-1/2 left-1/2 z-10 text-center w-full -translate-x-1/2 -translate-y-1/2"
        :style="{
          animation: `fadeInTitle 0.15s ease-out ${titleDelay} both`,
        }"
      >
        <h1 class="text-white title-font">
          {{ heroTitle }}
        </h1>
      </div>
    </Transition>

    <div class="absolute bottom-8 left-1/2 -translate-x-3 z-10 text-white">
      <UIcon name="i-lucide-chevron-down" class="size-6" />
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
