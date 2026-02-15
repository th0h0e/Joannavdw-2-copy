<script setup lang="ts">
const { projectTitles } = defineProps<{
  projectTitles: string[]
}>()

const emit = defineEmits<{
  linkClick: [index: number]
}>()

function handleClick(e: MouseEvent, index: number) {
  e.preventDefault()
  emit('linkClick', index)
}
</script>

<template>
  <div class="w-full text-center px-6 md:w-4/5 md:px-0">
    <ul class="space-y-1">
      <li
        v-for="(title, index) in projectTitles"
        :key="`${title}-${index}`"
      >
        <a
          :href="`#project-${index}`"
          class="title-font block text-black uppercase leading-none no-underline transition-all duration-200 hover:opacity-70"
          @click="handleClick($event, index)"
        >
          {{ title }}
        </a>
      </li>
    </ul>
  </div>
</template>
