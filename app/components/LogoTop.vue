<script setup lang="ts">
import Asset7Logo from '~/assets/logo svg/Asset 7.svg'

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
const isHidden = computed(() => props.showAboutPopup || (props.showPopup && isMobile))

const initialized = ref(false)
const yOffset = ref(0)

onMounted(() => {
  if (props.isHero) {
    const startTop = window.innerHeight * 0.32
    const finalTop = 60
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
      top: '60px',
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
        :src="Asset7Logo"
        alt="Joanna Logo Top"
        class="max-w-[54.15%] max-h-full"
      >
    </div>
    <div
      v-else
      class="w-full h-full flex items-center justify-center"
    >
      <img
        :src="Asset7Logo"
        alt="Joanna Logo Top"
        class="max-w-[54.15%] max-h-full"
      >
    </div>
  </button>
</template>
