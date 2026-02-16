<script setup lang="ts">
useHead({
  title: 'Joanna van der Werf - Creative Strategy',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
  ],
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage
        :transition="{
          name: 'page',
          mode: 'out-in',
        }"
      />
    </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Swipe transition for admin pages */
.swipe-enter-active,
.swipe-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.swipe-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.swipe-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
