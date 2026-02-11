<script setup lang="ts">
const { projectTitles } = defineProps<{
  projectTitles: string[]
}>()

const emit = defineEmits<{
  linkClick: [index: number]
}>()

const fontSizes = {
  mobile: 1.4,
  tablet: 2.5,
  desktop: 2.25,
  largeDesktop: 3,
}

useHead({
  style: [
    {
      innerHTML: `
        .project-navigation__link {
          font-size: ${fontSizes.mobile}rem;
        }
        @media (min-width: 768px) {
          .project-navigation__link { font-size: ${fontSizes.tablet}rem; }
        }
        @media (min-width: 1024px) {
          .project-navigation__link { font-size: ${fontSizes.desktop}rem; }
        }
        @media (min-width: 1280px) {
          .project-navigation__link { font-size: ${fontSizes.largeDesktop}rem; }
        }
      `,
    },
  ],
})

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
          :style="{
            fontFamily: 'EnduroWeb, sans-serif',
            letterSpacing: '0.03em',
          }"
          @click="handleClick($event, index)"
        >
          {{ title }}
        </a>
      </li>
    </ul>
  </div>
</template>
