<script setup lang="ts">
const props = withDefaults(defineProps<{
  isPopupVisible?: boolean
}>(), {
  isPopupVisible: false,
})

const { projectTitles } = usePortfolioProjects()

const isOpen = ref(false)

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

  setTimeout(() => {
    window.location.hash = `#project-${index}`

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
  <button
    v-if="!isPopupVisible"
    class="fixed top-[80px] right-5 md:top-[89px] md:right-[40px] z-[10000] cursor-pointer bg-none border-0 p-0"
    aria-label="Toggle menu"
    @click="toggleMenu"
  >
    <div
      class="hamburger-icon"
      :class="[isOpen ? 'hamburger-icon--open' : 'hamburger-icon--closed']"
    />
  </button>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-white z-[9998] cursor-pointer h-[100lvh]"
        role="button"
        tabindex="0"
        aria-label="Close menu"
        @click="closeMenu"
        @keydown.enter="closeMenu"
        @keydown.space.prevent="closeMenu"
        @keydown.esc="closeMenu"
      />
    </Transition>

    <Transition name="scale-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center h-[100lvh]"
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
.hamburger-icon {
  display: block;
  transition:
    transform 0.3s,
    background-color 0.3s,
    width 0.3s,
    height 0.3s;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
