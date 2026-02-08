<script setup lang="ts">
import type { Settings } from '@/config/pocketbase'
import { computed, onBeforeUnmount, watchEffect } from 'vue'
import { getResponsiveFontSizes } from '@/config/pocketbase'
import { navigationContainerClasses, navigationLinkClasses, navigationListClasses } from '@/utils/sharedStyles'

const props = withDefaults(defineProps<{
  projectTitles: string[]
  settingsData?: Settings | null
}>(), {
  settingsData: null,
})

const emit = defineEmits<{
  linkClick: [index: number]
}>()

const fontSizes = computed(() => getResponsiveFontSizes(props.settingsData))

// Dynamic style injection for responsive font sizes
const styleEl = document.createElement('style')
document.head.appendChild(styleEl)
watchEffect(() => {
  styleEl.textContent = `
    .project-navigation__link {
      font-size: ${fontSizes.value.mobile}rem;
    }
    @media (min-width: 768px) {
      .project-navigation__link { font-size: ${fontSizes.value.tablet}rem; }
    }
    @media (min-width: 1024px) {
      .project-navigation__link { font-size: ${fontSizes.value.desktop}rem; }
    }
    @media (min-width: 1280px) {
      .project-navigation__link { font-size: ${fontSizes.value.largeDesktop}rem; }
    }
  `
})
onBeforeUnmount(() => {
  styleEl.remove()
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
