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
    class="project-index w-full snap-center bg-white flex items-center justify-center"
  >
    <ProjectNavigation
      :project-titles="projectTitles"
      @link-click="handleLinkClick"
    />
  </section>
</template>

<style scoped>
.project-index {
  height: 100lvh;
}
</style>
