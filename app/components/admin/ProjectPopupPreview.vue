<script setup lang="ts">
import ProjectCardSVG from '~/assets/Project Card/JVDW WEB LIGHT BOX copy.svg'

defineProps<{
  projectTitle: string
  projectDescription: string
  projectResponsibility: string[]
}>()
</script>

<template>
  <div class="relative" style="width: 280px">
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
        :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
      >
        {{ projectTitle }}
      </h2>

      <div
        class="text-black uppercase text-center leading-tight"
        :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px', marginBottom: '18px' }"
      >
        <span v-for="(responsibility, index) in projectResponsibility" :key="`${responsibility}-${index}`">
          {{ responsibility }}<br v-if="index < projectResponsibility.length - 1">
        </span>
      </div>

      <p
        class="text-black text-center leading-tight"
        :style="{ fontFamily: 'EnduroWeb, sans-serif', letterSpacing: '0.03em', fontSize: '12px' }"
      >
        {{ projectDescription }}
      </p>
    </div>
  </div>
</template>
