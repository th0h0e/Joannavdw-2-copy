<script setup lang="ts">
const { projectTitles } = usePortfolioProjects()

function handleLinkClick(index: number) {
  window.location.hash = `#project-${index}`
}
</script>

<template>
  <section
    id="project-index"
    class="w-full h-[100lvh] snap-center bg-white flex items-center justify-center"
  >
    <ProjectNavigation
      :project-titles="projectTitles"
      @link-click="handleLinkClick"
    />
  </section>
</template>
