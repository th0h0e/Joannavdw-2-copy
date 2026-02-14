<script setup lang="ts">
const props = defineProps<{
  isAboutPopupVisible: boolean
}>()

const { heroImage, heroTitle } = useHomepageData()
const { isMobile } = useDevice()

const imageScaled = ref(false)

const showTitle = computed(() => !props.isAboutPopupVisible)

onMounted(() => {
  requestAnimationFrame(() => {
    imageScaled.value = true
  })
})
</script>

<template>
  <section
    id="hero-section"
    class="relative w-full snap-center bg-white flex items-center justify-center overflow-hidden"
    :class="isMobile ? 'h-[100lvh]' : 'h-screen'"
  >
    <div
      class="absolute inset-0 bg-cover bg-center transition-transform duration-1200 ease-out"
      :class="[imageScaled ? 'scale-100' : 'scale-30']"
      :style="{ backgroundImage: `url(${heroImage})` }"
    />

    <Transition
      enter-active-class="transition-opacity duration-150 delay-1200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTitle"
        class="absolute top-1/2 left-1/2 z-10 text-center w-full -translate-x-1/2 -translate-y-1/2"
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
.duration-1200 {
  transition-duration: 1200ms;
}

.scale-30 {
  transform: scale(0.3);
}
</style>
