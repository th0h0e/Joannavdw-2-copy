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
  <div class="relative">
    <img
      :src="ProjectCardSVG"
      alt="Project Card"
      class="popup-card-image w-full h-auto"
    >

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
</template>

<style scoped>
.popup-card-image {
  max-width: 90vw;
  max-height: 85vh;
  width: auto;
  height: auto;
}

.popup-text {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.4;
}
</style>
