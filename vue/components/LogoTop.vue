<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Asset7Logo from '@/assets/logo svg/Asset 7.svg'

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
  if (!hasAnimated.value && props.isHero) return 'calc(50% - 18vh)'
  return '60px'
})
</script>

<template>
  <div
    class="fixed cursor-pointer flex items-center justify-center"
    :style="{
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      mixBlendMode: 'exclusion',
      width: containerWidth,
      height: containerHeight,
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      transition: 'top 1.2s ease-out, opacity 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out',
      top: topPosition,
    }"
    @click="emit('click')"
  >
    <img
      :src="Asset7Logo"
      alt="Joanna Logo Top"
      :style="{
        filter: 'brightness(0) invert(1)',
        maxWidth: '54.15%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
      }"
    >
  </div>
</template>
