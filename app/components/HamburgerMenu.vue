<script setup lang="ts">
const props = withDefaults(defineProps<{
  projectTitles: string[]
  isPopupVisible?: boolean
}>(), {
  isPopupVisible: false,
})

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
      class="block transition-[transform,background-color,width,height] duration-300"
      :class="[
        isOpen
          ? 'mix-blend-normal bg-black w-[18px] h-[18px] rotate-45'
          : 'mix-blend-exclusion bg-white w-[17.32px] h-[17.32px] md:w-[18px] md:h-[18px] rotate-0',
      ]"
    />
  </button>

  <Teleport to="body">
    <Transition name="menu-backdrop">
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

    <Transition name="menu-content">
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
