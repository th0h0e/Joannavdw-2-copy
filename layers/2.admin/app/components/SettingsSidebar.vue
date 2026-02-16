<script setup lang="ts">
import type { AboutResponse, HomepageResponse, SettingsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import { pb } from '#layers/2.admin/app/utils/pocketbase'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  showToast: [message: string, type: 'success' | 'error']
}>()

const open = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value)
      emit('close')
  },
})

const faviconFileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)

const { data: rawData, refresh, status } = useAsyncData(
  'settings-sidebar',
  async () => {
    const [about, homepage, settings, fontSizes] = await Promise.all([
      pb.collection('About')
        .getFirstListItem<AboutResponse<string[]>>('Is_Active = true'),
      pb.collection('Homepage')
        .getFirstListItem<HomepageResponse>('Is_Active = true'),
      pb.collection('Settings')
        .getFirstListItem<SettingsResponse>(''),
      $fetch<{ mobile: number, tablet: number, desktop: number, largeDesktop: number }>('/api/font-sizes'),
    ])
    return { about, homepage, settings, fontSizes }
  },
  { immediate: false },
)

watch(open, (isOpen) => {
  if (isOpen)
    refresh()
})

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

  aboutDescription.value = data.about.About_Description ?? ''
  expertiseDescription.value = data.about.Expertise_Description ?? ''
  clientList.value = data.about.Client_List_Json ?? []
  contactEmail.value = data.about.Contact_Email ?? ''
  heroTitle.value = data.homepage.Hero_Title ?? ''
  showTopProgressBar.value = data.settings.Show_Top_Progress_Bar ?? false
  mobileFontSize.value = data.fontSizes.mobile
  tabletFontSize.value = data.fontSizes.tablet
  desktopFontSize.value = data.fontSizes.desktop
  largeDesktopFontSize.value = data.fontSizes.largeDesktop
  faviconUrl.value = `/assets/favicon.ico?v=${data.settings.updated}`
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
      headers: { Authorization: `Bearer ${pb.authStore.token}` },
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
    if (homepageData.value) {
      await pb.collection('Homepage')
        .update(homepageData.value.id, { Hero_Title: heroTitle.value })
    }

    if (aboutData.value) {
      await pb.collection('About')
        .update(aboutData.value.id, {
          About_Description: aboutDescription.value,
          Expertise_Description: expertiseDescription.value,
          Client_List_Json: clientList.value,
          Contact_Email: contactEmail.value,
        })
    }

    if (settingsData.value) {
      await pb.collection('Settings')
        .update(settingsData.value.id, {
          Show_Top_Progress_Bar: showTopProgressBar.value,
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
      headers: { Authorization: `Bearer ${pb.authStore.token}` },
    })

    emit('showToast', 'Settings saved successfully!', 'success')
    open.value = false
  }
  catch (err: unknown) {
    console.error('Error saving settings:', err)
    const error = err as { status?: number, data?: { message?: string }, message?: string }
    if (error?.status === 401 || error?.status === 403) {
      emit('showToast', 'Your session has expired. Please login again.', 'error')
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    emit('showToast', `Failed to save settings: ${error?.data?.message || error?.message || 'Unknown error'}`, 'error')
  }
  finally {
    saving.value = false
  }
}

const previewAboutData = computed(() => {
  if (!aboutData.value)
    return null
  return {
    ...aboutData.value,
    About_Description: aboutDescription.value,
    Expertise_Description: expertiseDescription.value,
    Client_List_Json: clientList.value,
    Contact_Email: contactEmail.value,
  }
})
</script>

<template>
  <UDrawer
    v-model:open="open"
    direction="right"
    :handle="false"
    :ui="{
      content: 'h-full w-3/4 md:w-1/2 max-w-none',
      body: 'p-0',
      header: 'p-6 border-b border-default',
    }"
  >
    <template #header>
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <h2 class="text-highlighted text-xl font-medium tracking-tight">
            Settings
          </h2>
          <p class="text-muted mt-1 text-xs tracking-wide uppercase">
            Configure site content
          </p>
        </div>

        <UButton
          variant="ghost"
          color="neutral"
          class="h-12 w-12 flex-shrink-0 overflow-hidden"
          title="Click to update favicon"
          @click="faviconFileInput?.click()"
        >
          <img
            v-if="faviconUrl"
            :src="faviconUrl"
            alt="Favicon"
            class="h-full w-full object-cover"
          >
          <div
            v-else
            class="flex h-full w-full items-center justify-center"
          >
            <UIcon
              name="i-ph-image"
              class="size-6"
            />
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
    </template>

    <template #body>
      <UForm
        :state="{}"
        class="flex h-full flex-col"
        @submit="handleSubmit"
      >
        <div class="flex-1 space-y-8 overflow-y-auto p-6">
          <div>
            <h3 class="text-highlighted mb-4 text-sm font-medium tracking-wider uppercase">
              Hero Section
            </h3>
            <UFormField label="Hero Title">
              <UInput
                v-model="heroTitle"
                placeholder="Creative Strategy and Communication"
                color="neutral"
                variant="subtle"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="border-default border-t" />

          <div>
            <h3 class="text-highlighted mb-4 text-sm font-medium tracking-wider uppercase">
              About Section
            </h3>
            <div class="space-y-4">
              <UFormField label="About Description">
                <UTextarea
                  v-model="aboutDescription"
                  :rows="4"
                  color="neutral"
                  variant="subtle"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Expertise Description">
                <UTextarea
                  v-model="expertiseDescription"
                  :rows="3"
                  color="neutral"
                  variant="subtle"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Client List"
                help="Press Enter to add a client"
              >
                <UInputTags
                  v-model="clientList"
                  placeholder="e.g., NIKE"
                  color="neutral"
                  variant="subtle"
                  :display-value="uppercaseDisplay"
                  :convert-value="handleAddTag"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>

          <div class="border-default border-t" />

          <div>
            <h3 class="text-highlighted mb-4 text-sm font-medium tracking-wider uppercase">
              Global Settings
            </h3>
            <div class="space-y-4">
              <UFormField label="Contact Email">
                <UInput
                  v-model="contactEmail"
                  type="email"
                  placeholder="hello@example.com"
                  color="neutral"
                  variant="subtle"
                  class="w-full"
                />
              </UFormField>
              <div>
                <p class="text-toned mb-2 text-xs font-medium tracking-wider uppercase">
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
                <USwitch
                  v-model="showTopProgressBar"
                  label="Show Top Progress Bar"
                />
                <p class="text-dimmed mt-1 text-xs">
                  Display progress bar at top of carousel
                </p>
              </UFormField>
            </div>
          </div>
        </div>

        <div class="border-default flex flex-shrink-0 gap-3 border-t p-6">
          <UButton
            type="button"
            variant="outline"
            class="flex-1"
            @click="open = false"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            variant="outline"
            color="neutral"
            :loading="loading"
            class="flex-1"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UDrawer>

  <div
    v-if="isOpen"
    class="pointer-events-none fixed top-1/2 left-[25%] z-[60] -translate-x-1/2 -translate-y-1/2"
  >
    <LazyAboutPopup
      :is-visible="isOpen"
      :about-data="previewAboutData"
      @close="() => {}"
    />
  </div>
</template>
