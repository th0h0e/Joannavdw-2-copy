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
const mounted = ref(false)

const containerWidth = computed(() => isMobile ? '160px' : '200px')
const containerHeight = computed(() => isMobile ? '60px' : '80px')
const isHidden = computed(() => props.showAboutPopup || (props.showPopup && isMobile))

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <button
    class="logo-top fixed left-1/2 -translate-x-1/2 z-50 cursor-pointer mix-blend-exclusion appearance-none bg-none border-0 p-0 m-0"
    :class="[
      isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto',
      mounted && isHero ? 'logo-top--hero' : 'logo-top--positioned',
    ]"
    :style="{ width: containerWidth, height: containerHeight }"
    aria-label="Open menu"
    @click="emit('click')"
  >
    <img
      :src="Asset7Logo"
      alt="Joanna Logo Top"
      class="max-w-[54.15%] max-h-full"
    >
  </button>
</template>

<style scoped>
.logo-top {
  transition:
    top 0.7s ease-out,
    opacity 0.3s ease-out;
}

.logo-top--hero {
  top: calc(50% - 18vh);
}

.logo-top--positioned {
  top: 60px;
}
</style>
