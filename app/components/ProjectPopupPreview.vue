<script setup lang="ts">
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

defineProps<{
  projectTitle: string
  projectDescription: string
  projectResponsibility: string[]
}>()
</script>

<template>
  <div class="relative w-[280px]">
    <img
      :src="ProjectCardSVG"
      alt="Project Card"
      class="w-[280px] h-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
    >

    <div class="absolute inset-0 flex flex-col justify-center px-4 py-8">
      <h2 class="text-popup-title text-black">
        {{ projectTitle }}
      </h2>

      <div class="text-popup-title text-black">
        <span v-for="(responsibility, index) in projectResponsibility" :key="`${responsibility}-${index}`">
          {{ responsibility }}<br v-if="index < projectResponsibility.length - 1">
        </span>
      </div>

      <p class="text-popup-body text-black">
        {{ projectDescription }}
      </p>
    </div>
  </div>
</template>
