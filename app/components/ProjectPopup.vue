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
    <div
      v-if="isVisible"
      class="fixed inset-0 z-40"
      @click="emit('close')"
    />
  </Transition>

  <Transition name="popup">
    <div
      v-if="isVisible"
      class="fixed z-50 popup-container"
      :style="{
        top: '50%',
        left: '50%',
        width: '280px',
        position: 'fixed',
        transform: 'translate(-50%, -50%) scale(var(--scale, 1))',
      }"
    >
      <div class="relative">
        <img
          :src="ProjectCardSVG"
          alt="Project Card"
          class="w-full h-auto"
          :style="{
            width: '280px',
            height: 'auto',
            filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.15))',
          }"
        >

        <!-- Project Content Overlay -->
        <div class="absolute inset-0 flex flex-col justify-center px-4 py-8">
          <h2
            class="text-black uppercase text-center leading-tight"
            :style="{
              fontFamily: 'EnduroWeb, sans-serif',
              letterSpacing: '0.03em',
              fontSize: '12px',
              marginBottom: '18px',
            }"
          >
            {{ projectTitle }}
          </h2>
          <div
            class="text-black uppercase text-center leading-tight"
            :style="{
              fontFamily: 'EnduroWeb, sans-serif',
              letterSpacing: '0.03em',
              fontSize: '12px',
              marginBottom: '18px',
            }"
          >
            <span v-for="(responsibility, index) in projectResponsibility" :key="`${responsibility}-${index}`">
              {{ responsibility }}<br v-if="index < projectResponsibility.length - 1">
            </span>
          </div>
          <p
            class="text-black text-center leading-tight"
            :style="{
              fontFamily: 'EnduroWeb, sans-serif',
              letterSpacing: '0.03em',
              fontSize: '12px',
            }"
          >
            {{ projectDescription }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@property --scale {
  syntax: '<number>';
  inherits: false;
  initial-value: 1;
}

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
