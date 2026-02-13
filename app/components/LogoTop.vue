<script setup lang="ts">
import Asset7Logo from '~/assets/logo svg/Asset 7.svg'

const props = defineProps<{
  isHero: boolean
  showAboutPopup: boolean
  showPopup: boolean
  isMobile: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const hasAnimated = ref(false)

onMounted(() => {
  // Trigger animation after mount (equivalent to initial -> animate in framer motion)
  requestAnimationFrame(() => {
    hasAnimated.value = true
  })
})

const containerWidth = computed(() => props.isMobile ? '160px' : '200px')
const containerHeight = computed(() => props.isMobile ? '60px' : '80px')

const isHidden = computed(() => props.showAboutPopup || (props.showPopup && props.isMobile))

const topPosition = computed(() => {
  if (!hasAnimated.value && props.isHero)
    return 'calc(50% - 18vh)'
  return '60px'
})
</script>

<template>
  <div
    class="logo-container"
    :style="{
      width: containerWidth,
      height: containerHeight,
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      top: topPosition,
    }"
    @click="emit('click')"
  >
    <img
      :src="Asset7Logo"
      alt="Joanna Logo Top"
      class="logo-image"
    >
  </div>
</template>

<style scoped>
/* Component-specific logo sizing */
.logo-image {
  max-width: 54.15%;
  max-height: 100%;
}
</style>
