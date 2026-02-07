<script setup lang="ts">
import { onMounted, ref } from 'vue'
import pb, { getCachedData, setCachedData, getImageUrl, getProjectTitleStyle } from '@/config/pocketbase'
import type { PortfolioProject, Homepage, About, Settings } from '@/config/pocketbase'
import type { ProjectImage } from '@/types/project'
import { projectTitleClasses, navigationLinkClasses } from '@/utils/sharedStyles'
import logoTop from '@/assets/logo svg/Asset 7.svg'
import logoBottom from '@/assets/logo svg/Asset 11.svg'

const loaded = ref(false)
const error = ref('')

onMounted(() => {
  // Verify all imports resolved
  try {
    console.log('PocketBase client:', pb.baseURL)
    console.log('Cache helpers:', typeof getCachedData, typeof setCachedData)
    console.log('Image helper:', typeof getImageUrl)
    console.log('Style helper:', typeof getProjectTitleStyle)
    console.log('Shared classes:', projectTitleClasses, navigationLinkClasses)
    console.log('Logo assets:', logoTop, logoBottom)
    loaded.value = true
  }
  catch (e) {
    error.value = String(e)
  }
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
    <h1 class="text-2xl mb-4" style="font-family: EnduroWeb, sans-serif; letter-spacing: 0.03em;">
      Portfolio — Vue version
    </h1>
    <div v-if="loaded" class="text-green-600 text-sm space-y-1 text-center">
      <p>All shared imports resolved successfully.</p>
      <p>PocketBase, types, utils, and assets are available.</p>
    </div>
    <div v-else-if="error" class="text-red-600 text-sm">
      <p>Import error: {{ error }}</p>
    </div>
    <p v-else class="text-gray-400 text-sm">Loading...</p>
  </div>
</template>
