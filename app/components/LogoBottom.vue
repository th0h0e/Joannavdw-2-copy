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
      :src="Asset11Logo"
      alt="Van Der Weg Logo Bottom"
      :style="{
        filter: 'brightness(0) invert(1)',
        maxWidth: '100%',
        maxHeight: '83.33%',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
      }"
    >
  </div>
</template>
