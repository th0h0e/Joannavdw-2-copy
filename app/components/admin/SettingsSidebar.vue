<script setup lang="ts">
import type { About, Homepage, Settings } from '~/plugins/pocketbase.client'
import { pb, getImageUrl } from '~/plugins/pocketbase.client'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  showToast: [message: string, type: 'success' | 'error']
}>()

const loading = ref(false)
const aboutData = ref<About | null>(null)
const homepageData = ref<Homepage | null>(null)
const settingsData = ref<Settings | null>(null)
const faviconFileInput = ref<HTMLInputElement | null>(null)

// Form fields - Homepage
const heroTitle = ref('')

// Form fields - Settings
const showTopProgressBar = ref(false)
const mobileFontSize = ref(1.25)
const tabletFontSize = ref(1.875)
const desktopFontSize = ref(2.25)
const largeDesktopFontSize = ref(3)
const faviconUrl = ref('')

// Form fields - About
const aboutDescription = ref('')
const expertiseDescription = ref('')
const clientList = ref<string[]>([])
const newClient = ref('')
const contactEmail = ref('')

async function fetchData() {
  try {
    loading.value = true

    const about = await pb.collection('About').getFirstListItem<About>('Is_Active = true')
    aboutData.value = about
    aboutDescription.value = about.About_Description
    expertiseDescription.value = about.Expertise_Description
    clientList.value = about.Client_List_Json || about.Client_List || []
    contactEmail.value = about.Contact_Email

    const homepage = await pb.collection('Homepage').getFirstListItem<Homepage>('Is_Active = true')
    homepageData.value = homepage
    heroTitle.value = homepage.Hero_Title

    const settings = await pb.collection('Settings').getFirstListItem<Settings>('')
    settingsData.value = settings
    showTopProgressBar.value = settings.Show_Top_Progress_Bar
    mobileFontSize.value = settings.Mobile_Font_Size
    tabletFontSize.value = settings.Tablet_Font_Size
    desktopFontSize.value = settings.Desktop_Font_Size
    largeDesktopFontSize.value = settings.Large_Desktop_Font_Size

    if (settings.favicon) {
      faviconUrl.value = getImageUrl(settings, settings.favicon)
    }
  }
  catch (err) {
    console.error('Error fetching settings:', err)
  }
  finally {
    loading.value = false
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen)
    fetchData()
})

function handleAddClient() {
  if (newClient.value.trim()) {
    clientList.value.push(newClient.value.trim().toUpperCase())
    newClient.value = ''
  }
}

function handleRemoveClient(index: number) {
  clientList.value = clientList.value.filter((_, i) => i !== index)
}

async function handleFaviconUpdate(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !settingsData.value)
    return

  try {
    const formData = new FormData()
    formData.append('favicon', file)

    await pb.collection('Settings').update(settingsData.value.id, formData)

    const updatedSettings = await pb.collection('Settings').getOne<Settings>(settingsData.value.id)
    if (updatedSettings.favicon) {
      faviconUrl.value = getImageUrl(updatedSettings, updatedSettings.favicon)
    }

    emit('showToast', 'Favicon updated! Please refresh the page to see the changes.', 'success')
  }
  catch (err: unknown) {
    console.error('Error updating favicon:', err)
    const error = err as { message?: string }
    emit('showToast', `Failed to update favicon: ${error?.message || 'Unknown error'}`, 'error')
  }
}

async function handleSubmit(e: Event) {
  e.preventDefault()
  loading.value = true

  try {
    if (homepageData.value) {
      await pb.collection('Homepage').update(homepageData.value.id, {
        Hero_Title: heroTitle.value,
      })
    }

    if (aboutData.value) {
      await pb.collection('About').update(aboutData.value.id, {
        About_Description: aboutDescription.value,
        Expertise_Description: expertiseDescription.value,
        Client_List_Json: clientList.value,
        Contact_Email: contactEmail.value,
      })
    }

    if (settingsData.value) {
      await pb.collection('Settings').update(settingsData.value.id, {
        Show_Top_Progress_Bar: showTopProgressBar.value,
        Mobile_Font_Size: mobileFontSize.value,
        Tablet_Font_Size: tabletFontSize.value,
        Desktop_Font_Size: desktopFontSize.value,
        Large_Desktop_Font_Size: largeDesktopFontSize.value,
      })
    }

    emit('showToast', 'Settings saved successfully!', 'success')
    emit('close')
  }
  catch (err: unknown) {
    console.error('Error saving settings:', err)
    const error = err as { message?: string }
    emit('showToast', `Failed to save settings: ${error?.message || 'Unknown error'}`, 'error')
  }
  finally {
    loading.value = false
  }
}

// Create preview data combining form values with existing aboutData
const previewAboutData = ref<About | null>(null)
watch([aboutData, aboutDescription, expertiseDescription, clientList, contactEmail], () => {
  if (aboutData.value) {
    previewAboutData.value = {
      ...aboutData.value,
      About_Description: aboutDescription.value,
      Expertise_Description: expertiseDescription.value,
      Client_List_Json: clientList.value,
      Contact_Email: contactEmail.value,
    }
  }
}, { deep: true })
</script>

<template>
  <template v-if="isOpen">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-neutral-900/70 backdrop-blur-md z-40 transition-opacity duration-300"
      @click="emit('close')"
    />

    <!-- About Popup Preview -->
    <div
      class="fixed top-1/2"
      :style="{ left: '25%', transform: 'translate(-50%, -50%)', zIndex: 45 }"
    >
      <LazyAboutPopup
        :is-visible="true"
        :about-data="previewAboutData"
        @close="() => {}"
      />
    </div>

    <!-- Sidebar -->
    <div
      class="fixed right-0 top-0 h-full w-3/4 md:w-1/2 bg-black/85 backdrop-blur-xl border-l border-neutral-700/60 shadow-2xl z-50 flex flex-col"
      :style="{ fontFamily: 'EnduroWeb, sans-serif' }"
    >
      <form class="flex flex-col h-full" @submit="handleSubmit">
        <!-- Sticky Header -->
        <div class="flex-shrink-0 p-8 border-b border-neutral-800/60 flex items-center gap-4 backdrop-blur-sm">
          <div class="flex-1">
            <h2 class="text-xl font-medium text-white tracking-tight">
              Settings
            </h2>
            <p class="text-xs text-neutral-400 mt-1 tracking-wide uppercase">
              Configure site content
            </p>
          </div>

          <!-- Favicon Avatar -->
          <div
            class="flex-shrink-0 w-12 h-12 rounded-sm bg-white/10 border border-neutral-700/60 hover:border-white/30 cursor-pointer transition-all overflow-hidden group hover:shadow-lg hover:shadow-white/5"
            title="Click to update favicon"
            @click="faviconFileInput?.click()"
          >
            <img
              v-if="faviconUrl"
              :src="faviconUrl"
              alt="Favicon"
              class="w-full h-full object-cover"
            >
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-neutral-500 group-hover:text-neutral-400 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>

          <input
            ref="faviconFileInput"
            type="file"
            accept="image/png,image/x-icon,image/svg+xml"
            class="hidden"
            @change="handleFaviconUpdate"
          >
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-8 space-y-8">
          <!-- Hero Section -->
          <div>
            <h3 class="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              Hero Section
            </h3>
            <div>
              <label class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">Hero Title</label>
              <input
                v-model="heroTitle"
                type="text"
                class="w-full px-4 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                placeholder="Creative Strategy and Communication"
              >
            </div>
          </div>

          <div class="border-t border-neutral-700/60" />

          <!-- About Section -->
          <div>
            <h3 class="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              About Section
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">About Description</label>
                <textarea
                  v-model="aboutDescription"
                  :rows="4"
                  class="w-full px-4 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all resize-none"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">Expertise Description</label>
                <textarea
                  v-model="expertiseDescription"
                  :rows="3"
                  class="w-full px-4 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all resize-none"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-300 mb-3 uppercase tracking-wider">Client List</label>
                <div class="flex gap-2 mb-3">
                  <input
                    v-model="newClient"
                    type="text"
                    class="flex-1 px-4 py-2.5 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                    placeholder="e.g., NIKE"
                    @keypress.enter.prevent="handleAddClient"
                  >
                  <button
                    type="button"
                    class="px-6 py-3 bg-white text-black rounded-sm text-sm hover:bg-neutral-100 font-medium transition-all uppercase tracking-wide"
                    @click="handleAddClient"
                  >
                    Add
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(client, idx) in clientList"
                    :key="`${client}-${idx}`"
                    class="flex items-center gap-2 px-3 py-1.5 bg-neutral-800/60 text-neutral-200 rounded-sm text-xs border border-neutral-700/60"
                  >
                    {{ client }}
                    <button
                      type="button"
                      class="text-red-400 hover:text-red-300 text-sm transition-colors"
                      @click="handleRemoveClient(idx)"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-neutral-700/60" />

          <!-- Global Settings -->
          <div>
            <h3 class="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              Global Settings
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">Contact Email</label>
                <input
                  v-model="contactEmail"
                  type="email"
                  class="w-full px-4 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                  placeholder="hello@example.com"
                >
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">Font Sizes (rem)</label>
                <div class="grid grid-cols-4 gap-2">
                  <div>
                    <label class="block text-xs text-neutral-400 mb-1">Mobile</label>
                    <input
                      v-model.number="mobileFontSize"
                      type="number"
                      step="0.125"
                      class="w-full px-2 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-neutral-400 mb-1">Tablet</label>
                    <input
                      v-model.number="tabletFontSize"
                      type="number"
                      step="0.125"
                      class="w-full px-2 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-neutral-400 mb-1">Desktop</label>
                    <input
                      v-model.number="desktopFontSize"
                      type="number"
                      step="0.125"
                      class="w-full px-2 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-neutral-400 mb-1">Large</label>
                    <input
                      v-model.number="largeDesktopFontSize"
                      type="number"
                      step="0.125"
                      class="w-full px-2 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                    >
                  </div>
                </div>
              </div>
              <div>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="showTopProgressBar"
                    type="checkbox"
                    class="w-4 h-4 bg-black/30 border border-neutral-700/60 rounded-sm text-white focus:ring-1 focus:ring-white/20"
                  >
                  <span class="text-xs font-medium text-neutral-300 uppercase tracking-wider">Show Top Progress Bar</span>
                </label>
                <p class="text-xs text-neutral-500 mt-1 ml-7">
                  Display progress bar at top of carousel
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="flex-shrink-0 p-8 border-t border-neutral-800/60 flex gap-3 backdrop-blur-sm">
          <button
            type="button"
            class="flex-1 px-6 py-3 bg-black/30 border border-neutral-700/60 text-neutral-200 rounded-sm text-sm hover:bg-black/50 hover:text-white hover:border-neutral-600/60 font-medium transition-all uppercase tracking-wide"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-white text-black rounded-sm text-sm hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10 transition-all font-medium tracking-wide uppercase disabled:bg-neutral-600 disabled:text-neutral-400"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </template>
</template>
