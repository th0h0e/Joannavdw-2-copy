<script setup lang="ts">
import Asset11Logo from '~/assets/logo svg/Asset 11.svg'

const props = defineProps<{
  isHero: boolean
  showAboutPopup: boolean
  showPopup: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const { isMobile, isTablet } = useDevice()

const containerWidth = computed(() => isMobile ? '160px' : '200px')
const containerHeight = computed(() => isMobile ? '60px' : '80px')
const containerHeightPx = computed(() => isMobile ? 60 : 80)
const isHidden = computed(() => props.showAboutPopup || props.showPopup)

const yOffset = computed(() => {
  if (!props.isHero)
    return 0
  if (isMobile)
    return -180
  if (isTablet)
    return -250
  return -320
})

const initialVariant = computed(() => ({
  y: yOffset.value,
}))

const enterVariant = {
  y: 0,
  transition: {
    type: 'keyframes' as const,
    duration: 1200,
    ease: 'easeOut' as const,
  },
}
</script>

<template>
  <button
    class="fixed left-1/2 z-50 m-0 -translate-x-1/2 cursor-pointer appearance-none border-0 bg-none p-0 mix-blend-exclusion"
    :style="{
      top: `calc(100vh - 60px - ${containerHeightPx}px)`,
      width: containerWidth,
      height: containerHeight,
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      transition: 'opacity 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out',
    }"
    aria-label="Open about"
    @click="emit('click')"
  >
    <div
      v-motion
      :initial="initialVariant"
      :enter="enterVariant"
      class="flex h-full w-full items-center justify-center"
    >
      <img
        :src="Asset11Logo"
        alt="Van Der Weg Logo Bottom"
        class="max-h-[83.33%] max-w-full"
      >
    </div>
  </button>
</template>
