<script setup lang="ts">
import type { Settings } from '~/plugins/pocketbase.client'

withDefaults(defineProps<{
  projectTitles: string[]
  settingsData?: Settings | null
}>(), {
  settingsData: null,
})

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
      :settings-data="settingsData"
      @link-click="handleLinkClick"
    />
  </section>
</template>
