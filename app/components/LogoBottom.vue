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
const hasAnimated = ref(false)

const containerWidth = computed(() => isMobile ? '160px' : '200px')
const containerHeight = computed(() => isMobile ? '60px' : '80px')
const isHidden = computed(() => props.showAboutPopup || (props.showPopup && isMobile))
const topPosition = computed(() => {
  if (!hasAnimated.value && props.isHero)
    return '68vh'
  return 'calc(100vh - 60px - 80px)'
})

onMounted(() => {
  requestAnimationFrame(() => {
    hasAnimated.value = true
  })
})
</script>

<template>
  <button
    class="fixed left-1/2 -translate-x-1/2 z-50 cursor-pointer mix-blend-exclusion transition-[top,opacity] ease-out pointer-events-auto appearance-none bg-none border-0 p-0 m-0"
    :class="[
      isHidden ? 'opacity-0 pointer-events-none duration-300' : 'opacity-100 duration-700',
    ]"
    :style="{
      width: containerWidth,
      height: containerHeight,
      top: topPosition,
    }"
    aria-label="Open menu"
    @click="emit('click')"
  >
    <img
      :src="Asset11Logo"
      alt="Van Der Weg Logo Bottom"
      class="max-w-full max-h-[83.33%]"
    >
  </button>
</template>
