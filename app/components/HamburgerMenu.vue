<script setup lang="ts">
const props = withDefaults(defineProps<{
  isPopupVisible?: boolean
}>(), {
  isPopupVisible: false,
})

const { projectTitles } = usePortfolioProjects()

const isOpen = ref(false)
const timeoutIds = ref<number[]>([])

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

  const id1 = window.setTimeout(() => {
    window.location.hash = `#project-${index}`

    const id2 = window.setTimeout(() => {
      const carousels = document.querySelectorAll('[data-carousel]')
      carousels.forEach((carousel) => {
        if (carousel instanceof HTMLElement) {
          carousel.scrollLeft = 0
        }
      })
    }, 100)
    timeoutIds.value.push(id2)
  }, 300)
  timeoutIds.value.push(id1)
}

onUnmounted(() => {
  timeoutIds.value.forEach(id => clearTimeout(id))
})
</script>

<template>
  <button
    v-if="!isPopupVisible"
    class="hamburger-button"
    :class="{ 'hamburger-button--open': isOpen }"
    aria-label="Toggle menu"
    @click="toggleMenu"
  >
    <div
      class="hamburger-icon pointer-events-none"
      :class="[isOpen ? 'hamburger-icon--open' : 'hamburger-icon--closed']"
    />
  </button>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="menu-backdrop"
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
        class="menu-content"
      >
        <div class="pointer-events-auto flex w-full items-center justify-center">
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
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10001;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}

.hamburger-button--open {
  z-index: 10002;
}

@media (min-width: 768px) {
  .hamburger-button {
    top: 89px;
    right: 40px;
  }
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
  height: 100lvh;
  cursor: pointer;
  background: white;
}

.menu-content {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  height: 100lvh;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

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
