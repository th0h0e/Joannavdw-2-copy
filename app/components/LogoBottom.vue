<script setup lang="ts">
import Asset11Logo from '~/assets/logo svg/Asset 11.svg'

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
  requestAnimationFrame(() => {
    hasAnimated.value = true
  })
})

const containerWidth = computed(() => props.isMobile ? '160px' : '200px')
const containerHeight = computed(() => props.isMobile ? '60px' : '80px')

const isHidden = computed(() => props.showAboutPopup || (props.showPopup && props.isMobile))

const topPosition = computed(() => {
  if (!hasAnimated.value && props.isHero)
    return '68vh'
  return 'calc(100vh - 60px - 80px)'
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
      :src="Asset11Logo"
      alt="Van Der Weg Logo Bottom"
      class="logo-image"
    >
  </div>
</template>

<style scoped>
/* Component-specific logo sizing */
.logo-image {
  max-width: 100%;
  max-height: 83.33%;
}
</style>
