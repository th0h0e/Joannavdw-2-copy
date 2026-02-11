<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const [aboutRes, homepageRes, portfolioRes, settingsRes] = await Promise.all([
  useFetch('https://admin.kontext.site/api/collections/About/records'),
  useFetch('https://admin.kontext.site/api/collections/Homepage/records'),
  useFetch(
    'https://admin.kontext.site/api/collections/Portfolio_Projects/records',
  ),
  useFetch('https://admin.kontext.site/api/collections/Settings/records'),
])

const aboutData = aboutRes.data
const homepageData = homepageRes.data
const portfolioData = portfolioRes.data
const settingsData = settingsRes.data
</script>

<template>
  <div>
    <p>{{ aboutData }}</p>
    <p>{{ homepageData }}</p>
    <p>{{ portfolioData }}</p>
    <p>{{ settingsData }}</p>
  </div>
</template>

<style scoped>
p {
  color: white;
}
</style>
