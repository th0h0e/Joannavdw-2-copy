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

const previewAboutData = ref<AboutResponse<string[]> | null>(null)
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
      class="bg-default/70 fixed inset-0 z-40 m-0 appearance-none border-0 bg-transparent p-0 text-left backdrop-blur-md transition-opacity duration-300"
      aria-label="Close settings"
      @click="emit('close')"
    />

    <div class="fixed top-1/2 left-[25%] z-45 -translate-x-1/2 -translate-y-1/2">
      <LazyAboutPopup
        :is-visible="true"
        :about-data="previewAboutData"
        @close="() => {}"
      />
    </div>

    <div class="bg-elevated border-default fixed top-0 right-0 z-50 flex h-full w-3/4 flex-col border-l font-['EnduroWeb',sans-serif] shadow-2xl backdrop-blur-xl md:w-1/2">
      <UForm
        :state="{}"
        class="flex h-full flex-col"
        @submit="handleSubmit"
      >
        <div class="border-default flex flex-shrink-0 items-center gap-4 border-b p-8 backdrop-blur-sm">
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

        <div class="flex-1 space-y-8 overflow-y-auto p-8">
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
                />
              </UFormField>
              <UFormField label="Expertise Description">
                <UTextarea
                  v-model="expertiseDescription"
                  :rows="3"
                  color="neutral"
                  variant="subtle"
                />
              </UFormField>
              <div>
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
                  />
                </UFormField>
              </div>
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

        <div class="border-default flex flex-shrink-0 gap-3 border-t p-8 backdrop-blur-sm">
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
