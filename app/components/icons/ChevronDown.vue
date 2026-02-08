<script setup lang="ts">
withDefaults(defineProps<{
  width?: number
  height?: number
  color?: string
}>(), {
  width: 24,
  height: 24,
  color: 'white',
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
</template>
