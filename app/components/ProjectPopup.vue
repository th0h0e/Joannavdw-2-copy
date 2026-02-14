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
      class="max-w-[90vw] max-h-[85vh] w-auto h-auto w-full h-auto"
    >

    <div class="absolute inset-0 flex flex-col justify-center px-4 py-8">
      <h2 class="font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-xl font-bold tracking-wide leading-snug text-black uppercase">
        {{ projectTitle }}
      </h2>
      <div class="font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-xl font-bold tracking-wide leading-snug text-black uppercase">
        <span v-for="(responsibility, index) in projectResponsibility" :key="`${responsibility}-${index}`">
          {{ responsibility }}<br v-if="index < projectResponsibility.length - 1">
        </span>
      </div>
      <p class="font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-black">
        {{ projectDescription }}
      </p>
    </div>
  </div>
</template>
