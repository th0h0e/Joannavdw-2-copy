<script setup lang="ts">
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

const props = defineProps<{
  projectTitle: string
}>()

const { projects } = usePortfolioProjects()

const project = computed(() => projects.value.find(p => p.title === props.projectTitle))
const projectDescription = computed(() => project.value?.description || '')
const projectResponsibility = computed<string[]>(() => project.value?.responsibility || [])
</script>

<template>
  <div class="popup-container">
    <img
      :src="ProjectCardSVG"
      alt="Project Card"
      class="popup-card-image"
    >

    <div class="absolute inset-0 flex flex-col justify-center px-4 py-8">
      <h2 class="text-popup-title">
        {{ projectTitle }}
      </h2>
      <div class="text-popup-title">
        <span
          v-for="(responsibility, index) in projectResponsibility"
          :key="`${responsibility}-${index}`"
        >
          {{ responsibility }}<br v-if="index < projectResponsibility.length - 1">
        </span>
      </div>
      <p class="text-popup-body">
        {{ projectDescription }}
      </p>
    </div>
  </div>
</template>
