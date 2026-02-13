<script setup lang="ts">
const props = withDefaults(defineProps<{
  projectTitles: string[]
  isPopupVisible?: boolean
}>(), {
  isPopupVisible: false,
})

const isOpen = ref(false)
const { isTabletOrAbove } = useBreakpoints()

function toggleMenu() {
  if (props.isPopupVisible)
    return
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function handleLinkClick(index: number) {
  closeMenu()

  // Navigate after menu closes to avoid state conflicts
  setTimeout(() => {
    window.location.hash = `#project-${index}`

    // Reset all carousels to first slide after navigation
    setTimeout(() => {
      const carousels = document.querySelectorAll('[data-carousel]')
      carousels.forEach((carousel) => {
        if (carousel instanceof HTMLElement) {
          carousel.scrollLeft = 0
        }
      })
    }, 100)
  }, 300)
}
</script>

<template>
  <!-- Hamburger Button -->
  <button
    v-if="!isPopupVisible"
    class="fixed top-[80px] right-5 md:top-[89px] md:right-[40px] z-[10000] cursor-pointer"
    aria-label="Toggle menu"
    @click="toggleMenu"
  >
    <div
      class="block md:w-[18px] md:h-[18px]"
      :style="{
        mixBlendMode: isOpen ? 'normal' : 'exclusion',
        transform: `rotate(${isOpen ? 45 : 0}deg)`,
        backgroundColor: isOpen ? '#000000' : '#ffffff',
        width: isOpen ? '18px' : (isTabletOrAbove ? '18px' : '17.32px'),
        height: isOpen ? '18px' : (isTabletOrAbove ? '18px' : '17.32px'),
        transition: 'transform 0.3s, background-color 0.3s, width 0.3s, height 0.3s',
      }"
    />
  </button>

  <!-- Menu Overlay -->
  <Teleport to="body">
    <Transition name="menu-backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-white z-[9998] cursor-pointer"
        role="button"
        tabindex="0"
        aria-label="Close menu"
        :style="{ height: '100lvh' }"
        @click="closeMenu"
        @keydown.enter="closeMenu"
        @keydown.space.prevent="closeMenu"
        @keydown.esc="closeMenu"
      />
    </Transition>

    <Transition name="menu-content">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
        :style="{ height: '100lvh' }"
      >
        <div class="w-full flex items-center justify-center">
          <ProjectNavigation
            :project-titles="projectTitles"
            @link-click="handleLinkClick"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.menu-backdrop-enter-active,
.menu-backdrop-leave-active {
  transition: opacity 0.3s ease-out;
}
.menu-backdrop-enter-from,
.menu-backdrop-leave-to {
  opacity: 0;
}

.menu-content-enter-active,
.menu-content-leave-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}
.menu-content-enter-from,
.menu-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
