<script setup lang="ts">
const { projectTitles } = defineProps<{
  projectTitles: string[]
}>()

const emit = defineEmits<{
  linkClick: [index: number]
}>()

const fontSizes = useFontSizes()

function handleClick(e: MouseEvent, index: number) {
  // If there are listeners for linkClick, prevent default and emit
  e.preventDefault()
  emit('linkClick', index)
}
</script>

<template>
  <div :class="navigationContainerClasses">
    <ul :class="navigationListClasses">
      <li v-for="(title, index) in projectTitles" :key="`${title}-${index}`">
        <a
          :href="`#project-${index}`"
          :class="`${navigationLinkClasses} project-navigation__link`"
          @click="handleClick($event, index)"
        >
          {{ title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.project-navigation__link {
  font-family: 'EnduroWeb, sans-serif';
  letter-spacing: 0.03em;
  font-size: v-bind('fontSizes.mobile + "rem"');
}

@media (min-width: 768px) {
  .project-navigation__link {
    font-size: v-bind('fontSizes.tablet + "rem"');
  }
}

@media (min-width: 1024px) {
  .project-navigation__link {
    font-size: v-bind('fontSizes.desktop + "rem"');
  }
}

@media (min-width: 1280px) {
  .project-navigation__link {
    font-size: v-bind('fontSizes.largeDesktop + "rem"');
  }
}
</style>
