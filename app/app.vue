<script setup lang="ts">
useHead({
  title: "Joanna van der Werf - Creative Strategy",
  viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
  meta: [
    { name: "format-detection", content: "telephone=no" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
  ],
  link: [{ rel: "manifest", href: "/manifest.json" }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
