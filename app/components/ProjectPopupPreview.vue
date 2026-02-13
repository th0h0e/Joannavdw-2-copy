<script setup lang="ts">
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

defineProps<{
  projectTitle: string
  projectDescription: string
  projectResponsibility: string[]
}>()
</script>

<template>
  <div class="project-popup-preview relative">
    <img
      :src="ProjectCardSVG"
      alt="Project Card"
      class="project-popup-preview__card w-full h-auto"
    >

    <!-- Project Content Overlay -->
    <div class="absolute inset-0 flex flex-col justify-center px-4 py-8">
      <h2 class="project-popup-preview__title text-black uppercase text-center leading-tight">
        {{ projectTitle }}
      </h2>

      <div class="project-popup-preview__responsibilities text-black uppercase text-center leading-tight">
        <span v-for="(responsibility, index) in projectResponsibility" :key="`${responsibility}-${index}`">
          {{ responsibility }}<br v-if="index < projectResponsibility.length - 1">
        </span>
      </div>

      <p class="project-popup-preview__description text-black text-center leading-tight">
        {{ projectDescription }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.project-popup-preview {
  width: 280px;
}

.project-popup-preview__card {
  width: 280px;
  height: auto;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.15));
}

.project-popup-preview__title,
.project-popup-preview__responsibilities,
.project-popup-preview__description {
  font-family: 'EnduroWeb, sans-serif';
  letter-spacing: 0.03em;
  font-size: 12px;
}

.project-popup-preview__title {
  margin-bottom: 18px;
}

.project-popup-preview__responsibilities {
  margin-bottom: 18px;
}
</style>
