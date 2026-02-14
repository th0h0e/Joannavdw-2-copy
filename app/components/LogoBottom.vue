<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import Asset11Logo from '~/assets/logo svg/Asset 11.svg'

const props = defineProps<{
  isHero: boolean
  showAboutPopup: boolean
  showPopup: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const { isMobile } = useDevice()
const { height: windowHeight } = useWindowSize()

const containerWidth = computed(() => isMobile ? '160px' : '200px')
const containerHeight = computed(() => isMobile ? '60px' : '80px')
const containerHeightPx = computed(() => isMobile ? 60 : 80)
const isHidden = computed(() => props.showAboutPopup || (props.showPopup && isMobile))

const finalTop = computed(() => windowHeight.value - 60 - containerHeightPx.value)

const startTop = computed(() => windowHeight.value * 0.68)

const yOffset = computed(() => props.isHero ? startTop.value - finalTop.value : 0)

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
    class="fixed left-1/2 -translate-x-1/2 z-50 cursor-pointer mix-blend-exclusion appearance-none bg-none border-0 p-0 m-0"
    :style="{
      top: `${finalTop}px`,
      width: containerWidth,
      height: containerHeight,
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      transition: 'opacity 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out',
    }"
    aria-label="Open menu"
    @click="emit('click')"
  >
    <div
      v-motion
      :initial="initialVariant"
      :enter="enterVariant"
      class="w-full h-full flex items-center justify-center"
    >
      <img
        :src="Asset11Logo"
        alt="Van Der Weg Logo Bottom"
        class="max-w-full max-h-[83.33%]"
      >
    </div>
  </button>
</template>
