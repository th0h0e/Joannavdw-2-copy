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
    class="hamburger-button fixed top-[80px] right-5 md:top-[89px] md:right-[40px] z-[10000] cursor-pointer"
    aria-label="Toggle menu"
    @click="toggleMenu"
  >
    <div
      class="hamburger-icon"
      :class="{ 'hamburger-icon--open': isOpen, 'hamburger-icon--closed': !isOpen }"
    />
  </button>

  <!-- Menu Overlay -->
  <Teleport to="body">
    <Transition name="menu-backdrop">
      <div
        v-if="isOpen"
        class="menu-overlay fixed inset-0 bg-white z-[9998] cursor-pointer"
        role="button"
        tabindex="0"
        aria-label="Close menu"
        @click="closeMenu"
        @keydown.enter="closeMenu"
        @keydown.space.prevent="closeMenu"
        @keydown.esc="closeMenu"
      />
    </Transition>

    <Transition name="menu-content">
      <div
        v-if="isOpen"
        class="menu-content-wrapper fixed inset-0 z-[9999] flex items-center justify-center"
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
.hamburger-button {
  background: none;
  border: none;
  padding: 0;
}

.hamburger-icon {
  display: block;
  transition: transform 0.3s, background-color 0.3s, width 0.3s, height 0.3s;
}

.hamburger-icon--closed {
  mix-blend-mode: exclusion;
  background-color: #ffffff;
  width: 17.32px;
  height: 17.32px;
  transform: rotate(0deg);
}

.hamburger-icon--open {
  mix-blend-mode: normal;
  background-color: #000000;
  width: 18px;
  height: 18px;
  transform: rotate(45deg);
}

@media (min-width: 768px) {
  .hamburger-icon--closed {
    width: 18px;
    height: 18px;
  }
}

.menu-overlay {
  height: 100lvh;
}

.menu-content-wrapper {
  height: 100lvh;
}

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
