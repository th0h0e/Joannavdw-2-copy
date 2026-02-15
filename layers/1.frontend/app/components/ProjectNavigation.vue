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
  <div :class="navigationContainerClasses">
    <ul :class="navigationListClasses">
      <li
        v-for="(title, index) in projectTitles"
        :key="`${title}-${index}`"
      >
        <a
          :href="`#project-${index}`"
          :class="`${navigationLinkClasses} title-font`"
          @click="handleClick($event, index)"
        >
          {{ title }}
        </a>
      </li>
    </ul>
  </div>
</template>
