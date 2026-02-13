<script setup lang="ts">
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

defineProps<{
  isVisible: boolean
  projectTitle: string
  projectDescription: string
  projectResponsibility: string[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition name="popup-backdrop">
    <button
      v-if="isVisible"
      class="fixed inset-0 z-40"
      aria-label="Close popup"
      @click="emit('close')"
    />
  </Transition>

  <Transition name="popup">
    <div
      v-if="isVisible"
      class="popup-container z-50"
    >
      <div class="relative">
        <img
          :src="ProjectCardSVG"
          alt="Project Card"
          class="popup-card-image w-full h-auto"
        >

        <!-- Project Content Overlay -->
        <div class="absolute inset-0 flex flex-col justify-center px-4 py-8">
          <h2 class="popup-text popup-title text-black uppercase">
            {{ projectTitle }}
          </h2>
          <div class="popup-text popup-title text-black uppercase">
            <span v-for="(responsibility, index) in projectResponsibility" :key="`${responsibility}-${index}`">
              {{ responsibility }}<br v-if="index < projectResponsibility.length - 1">
            </span>
          </div>
          <p class="popup-text text-black">
            {{ projectDescription }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Component-specific styles */
.popup-backdrop {
  appearance: none;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: left;
}

/* Component-specific transition styles */
.popup-enter-active,
.popup-leave-active {
  transition:
    --scale 0.3s ease-out,
    opacity 0.3s ease-out;
}
.popup-enter-from,
.popup-leave-to {
  --scale: 0.8;
  opacity: 0;
}
.popup-enter-to,
.popup-leave-from {
  --scale: 1;
  opacity: 1;
}

.popup-backdrop-enter-active,
.popup-backdrop-leave-active {
  transition: opacity 0.3s ease-out;
}
.popup-backdrop-enter-from,
.popup-backdrop-leave-to {
  opacity: 0;
}
</style>
