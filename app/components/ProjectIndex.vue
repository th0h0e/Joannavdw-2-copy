<script setup lang="ts">
const { projectTitles } = usePortfolioProjects()

function handleLinkClick(index: number) {
  if (import.meta.server)
    return
  window.location.hash = `#project-${index}`
}
</script>

<template>
  <section
    id="project-index"
    class="flex h-[100lvh] w-full snap-center items-center justify-center bg-white"
  >
    <ProjectNavigation
      :project-titles="projectTitles"
      @link-click="handleLinkClick"
    />
  </section>
</template>
