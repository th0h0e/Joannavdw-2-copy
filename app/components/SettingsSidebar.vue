<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  showToast: [message: string, type: 'success' | 'error']
}>()

const faviconFileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)

const { data: rawData, refresh, status } = useAsyncData(
  'settings-sidebar',
  async () => {
    const [about, homepage, settings, fontSizes] = await Promise.all([
      pb.collection('Settings').getFirstListItem<Settings>(''),
      $fetch<{ mobile: number, tablet: number, desktop: number, largeDesktop: number }>('/api/font-sizes'),
    ])
    return { about, homepage, settings, fontSizes }
  },
  { immediate: false },
)

const loading = computed(() => status.value === 'pending' || saving.value)

const aboutData = computed(() => rawData.value?.about || null)
const homepageData = computed(() => rawData.value?.homepage || null)
const settingsData = computed(() => rawData.value?.settings || null)

const heroTitle = ref('')
const showTopProgressBar = ref(false)
const mobileFontSize = ref(1.25)
const tabletFontSize = ref(1.875)
const desktopFontSize = ref(2.25)
const largeDesktopFontSize = ref(3)
const faviconUrl = ref('')
const aboutDescription = ref('')
const expertiseDescription = ref('')
const clientList = ref<string[]>([])
const contactEmail = ref('')

const uppercaseDisplay = (value: string) => value.toUpperCase()

watch(rawData, (data) => {
  if (!data)
    return

  aboutDescription.value = data.about.About_Description
  expertiseDescription.value = data.about.Expertise_Description
  clientList.value = data.about.Client_List_Json || data.about.Client_List || []
  contactEmail.value = data.about.Contact_Email
  heroTitle.value = data.homepage.Hero_Title
  showTopProgressBar.value = data.settings.Show_Top_Progress_Bar
  mobileFontSize.value = data.fontSizes.mobile
  tabletFontSize.value = data.fontSizes.tablet
  desktopFontSize.value = data.fontSizes.desktop
  largeDesktopFontSize.value = data.fontSizes.largeDesktop
  faviconUrl.value = `/assets/favicon.ico?v=${data.settings.updated}`
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen)
    refresh()
})

function handleAddTag(value: string) {
  return value.toUpperCase()
}

async function handleFaviconUpdate(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  try {
    const formData = new FormData()
    formData.append('icon', file)

    await $fetch('/api/favicon', {
      method: 'PUT',
      body: formData,
    })

    faviconUrl.value = `/assets/favicon.ico?v=${Date.now()}`
    emit('showToast', 'Favicon updated successfully!', 'success')
  }
  catch (err: unknown) {
    console.error('Error updating favicon:', err)
    const error = err as { message?: string }
    emit('showToast', `Failed to update favicon: ${error?.message || 'Unknown error'}`, 'error')
  }
}

async function handleSubmit(e: Event) {
  e.preventDefault()
  saving.value = true

  try {
    const authHeaders = { Authorization: pb.authStore.token }

    if (homepageData.value) {
      await $fetch(`/api/homepage/${homepageData.value.id}`, {
        method: 'PUT',
        body: { Hero_Title: heroTitle.value },
        headers: authHeaders,
      })
    }

    if (aboutData.value) {
      await $fetch(`/api/about/${aboutData.value.id}`, {
        method: 'PUT',
        body: {
          About_Description: aboutDescription.value,
          Expertise_Description: expertiseDescription.value,
          Client_List_Json: clientList.value,
          Contact_Email: contactEmail.value,
        },
        headers: authHeaders,
      })
    }

    if (settingsData.value) {
      await $fetch(`/api/settings/${settingsData.value.id}`, {
        method: 'PUT',
        body: {
          Show_Top_Progress_Bar: showTopProgressBar.value,
        },
        headers: authHeaders,
      })
    }

    await $fetch('/api/font-sizes', {
      method: 'PUT',
      body: {
        mobile: mobileFontSize.value,
        tablet: tabletFontSize.value,
        desktop: desktopFontSize.value,
        largeDesktop: largeDesktopFontSize.value,
      },
    })

    emit('showToast', 'Settings saved successfully!', 'success')
    emit('close')
  }
  catch (err: unknown) {
    console.error('Error saving settings:', err)
    const error = err as { data?: { message?: string }, message?: string }
    emit('showToast', `Failed to save settings: ${error?.data?.message || error?.message || 'Unknown error'}`, 'error')
  }
  finally {
    saving.value = false
  }
}

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
    <button
      class="settings-backdrop fixed inset-0 bg-neutral-900/70 backdrop-blur-md z-40 transition-opacity duration-300"
      aria-label="Close settings"
      @click="emit('close')"
    />

    <div class="settings-preview fixed top-1/2">
      <LazyAboutPopup
        :is-visible="true"
        :about-data="previewAboutData"
        @close="() => {}"
      />
    </div>

    <div class="settings-sidebar fixed right-0 top-0 h-full w-3/4 md:w-1/2 bg-black/85 backdrop-blur-xl border-l border-neutral-700/60 shadow-2xl z-50 flex flex-col">
      <UForm :state="{}" class="flex flex-col h-full" @submit="handleSubmit">
        <div class="flex-shrink-0 p-8 border-b border-neutral-800/60 flex items-center gap-4 backdrop-blur-sm">
          <div class="flex-1">
            <h2 class="text-xl font-medium text-white tracking-tight">
              Settings
            </h2>
            <p class="text-xs text-neutral-400 mt-1 tracking-wide uppercase">
              Configure site content
            </p>
          </div>

          <UButton
            variant="ghost"
            class="flex-shrink-0 w-12 h-12 rounded-sm overflow-hidden"
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
              class="w-full h-full flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </UButton>

          <input
            id="faviconFileInput"
            ref="faviconFileInput"
            type="file"
            accept="image/png,image/x-icon,image/svg+xml"
            class="hidden"
            aria-label="Update Favicon"
            @change="handleFaviconUpdate"
          >
        </div>

        <div class="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <h3 class="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              Hero Section
            </h3>
            <UFormField label="Hero Title">
              <UInput
                v-model="heroTitle"
                placeholder="Creative Strategy and Communication"
              />
            </UFormField>
          </div>

          <div class="border-t border-neutral-700/60" />

          <div>
            <h3 class="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              About Section
            </h3>
            <div class="space-y-4">
              <UFormField label="About Description">
                <UTextarea
                  v-model="aboutDescription"
                  :rows="4"
                />
              </UFormField>
              <UFormField label="Expertise Description">
                <UTextarea
                  v-model="expertiseDescription"
                  :rows="3"
                />
              </UFormField>
              <div>
                <UFormField label="Client List" help="Press Enter to add a client">
                  <UInputTags
                    v-model="clientList"
                    placeholder="e.g., NIKE"
                    color="neutral"
                    variant="subtle"
                    :display-value="uppercaseDisplay"
                    :convert-value="handleAddTag"
                    class="bg-black/30 border-neutral-700/60"
                  />
                </UFormField>
              </div>
            </div>
          </div>

          <div class="border-t border-neutral-700/60" />

          <div>
            <h3 class="text-sm font-medium text-white mb-4 uppercase tracking-wider">
              Global Settings
            </h3>
            <div class="space-y-4">
              <UFormField label="Contact Email">
                <UInput
                  v-model="contactEmail"
                  type="email"
                  placeholder="hello@example.com"
                />
              </UFormField>
              <div>
                <p class="text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">
                  Font Sizes (rem)
                </p>
                <div class="grid grid-cols-4 gap-2">
                  <UFormField label="Mobile">
                    <UInputNumber
                      v-model="mobileFontSize"
                      :step="0.125"
                      :increment="false"
                      :decrement="false"
                      color="neutral"
                      variant="subtle"
                    />
                  </UFormField>
                  <UFormField label="Tablet">
                    <UInputNumber
                      v-model="tabletFontSize"
                      :step="0.125"
                      :increment="false"
                      :decrement="false"
                      color="neutral"
                      variant="subtle"
                    />
                  </UFormField>
                  <UFormField label="Desktop">
                    <UInputNumber
                      v-model="desktopFontSize"
                      :step="0.125"
                      :increment="false"
                      :decrement="false"
                      color="neutral"
                      variant="subtle"
                    />
                  </UFormField>
                  <UFormField label="Large">
                    <UInputNumber
                      v-model="largeDesktopFontSize"
                      :step="0.125"
                      :increment="false"
                      :decrement="false"
                      color="neutral"
                      variant="subtle"
                    />
                  </UFormField>
                </div>
              </div>
              <UFormField>
                <USwitch v-model="showTopProgressBar" label="Show Top Progress Bar" />
                <p class="text-xs text-neutral-500 mt-1">
                  Display progress bar at top of carousel
                </p>
              </UFormField>
            </div>
          </div>
        </div>

        <div class="flex-shrink-0 p-8 border-t border-neutral-800/60 flex gap-3 backdrop-blur-sm">
          <UButton
            type="button"
            variant="outline"
            class="flex-1"
            @click="emit('close')"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="loading"
            class="flex-1"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </UButton>
        </div>
      </UForm>
    </div>
  </template>
</template>

<style scoped>
.settings-backdrop {
  z-index: 40;
  appearance: none;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: left;
}

.settings-preview {
  left: 25%;
  transform: translate(-50%, -50%);
  z-index: 45;
}

.settings-sidebar {
  font-family: 'EnduroWeb, sans-serif';
}
</style>
