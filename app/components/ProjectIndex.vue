<script setup lang="ts">
const { data: portfolioRes } = useNuxtData('portfolio')
const projectTitles = computed(() => {
  const items = portfolioRes.value?.items ?? []
  return items
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.Order as number) - (b.Order as number))
    .map((p: Record<string, unknown>) => p.Title as string)
})

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
