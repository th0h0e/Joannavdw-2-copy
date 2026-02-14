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

const { isMobile } = useDevice()

const containerWidth = computed(() => isMobile ? '160px' : '200px')
const containerHeight = computed(() => isMobile ? '60px' : '80px')
const containerHeightPx = computed(() => isMobile ? 60 : 80)
const isHidden = computed(() => props.showAboutPopup || (props.showPopup && isMobile))

const initialized = ref(false)
const yOffset = ref(0)

onMounted(() => {
  if (props.isHero) {
    const startTop = window.innerHeight * 0.68
    const finalTop = window.innerHeight - 60 - containerHeightPx.value
    yOffset.value = startTop - finalTop
  }
  initialized.value = true
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
    delay: 100,
  },
}
</script>

<template>
  <button
    class="fixed left-1/2 -translate-x-1/2 z-50 cursor-pointer mix-blend-exclusion appearance-none bg-none border-0 p-0 m-0"
    :style="{
      top: `calc(100vh - 60px - ${containerHeightPx}px)`,
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
      v-if="initialized"
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
    <div
      v-else
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
