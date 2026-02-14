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
    class="logo-bottom fixed left-1/2 -translate-x-1/2 z-50 cursor-pointer mix-blend-exclusion appearance-none bg-none border-0 p-0 m-0 flex items-center justify-center"
    :class="[
      isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto',
      mounted && isHero ? 'logo-bottom--hero' : 'logo-bottom--positioned',
    ]"
    :style="{ width: containerWidth, height: containerHeight }"
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

<style scoped>
.logo-bottom {
  transition:
    top 0.7s ease-out,
    opacity 0.3s ease-out;
}

.logo-bottom--hero {
  top: 68vh;
}

.logo-bottom--positioned {
  top: calc(100vh - 140px);
}
</style>
