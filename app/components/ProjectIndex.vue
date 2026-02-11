<script setup lang="ts">
defineProps<{
  projectTitles: string[]
}>()

function handleLinkClick(index: number) {
  window.location.hash = `#project-${index}`
}
</script>

<template>
  <section
    id="project-index"
    class="w-full snap-center bg-white flex items-center justify-center"
    style="height: 100lvh"
  >
    <ProjectNavigation
      :project-titles="projectTitles"
      @link-click="handleLinkClick"
    />
  </section>
</template>
