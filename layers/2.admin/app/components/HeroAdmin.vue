<script setup lang="ts">
import type { HomepageResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import { getImageUrl, pb } from '#layers/2.admin/app/utils/pocketbase'
import { usePointerSwipe } from '@vueuse/core'

const emit = defineEmits<{
  showToast: [message: string, type: 'success' | 'error']
}>()

const showMobilePreview = ref(false)
const isEditingTitle = ref(false)
const tempTitle = ref('')
const heroFileInput = ref<HTMLInputElement | null>(null)
const heroMobileFileInput = ref<HTMLInputElement | null>(null)
const heroContainerRef = ref<HTMLElement | null>(null)

const { data: homepageRaw, refresh: refreshHomepage, error: homepageError } = useAsyncData(
  'admin-homepage',
  () => pb.collection('Homepage')
    .getFirstListItem<HomepageResponse>('Is_Active = true', { requestKey: null }),
)

const heroImage = computed(() =>
  homepageRaw.value?.Hero_Image ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image) : '')
const heroImageMobile = computed(() =>
  homepageRaw.value?.Hero_Image_Mobile ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image_Mobile) : '')
const homepageId = computed(() => homepageRaw.value?.id || '')

usePointerSwipe(heroContainerRef, {
  onSwipeEnd: (_e, direction) => {
    if (isEditingTitle.value)
      return
    if (direction === 'left' && heroImageMobile.value) {
      showMobilePreview.value = true
    }
    else if (direction === 'right') {
      showMobilePreview.value = false
    }
  },
})

const heroTitle = ref('')
watch(homepageRaw, (val) => {
  if (val)
    heroTitle.value = val.Hero_Title || ''
}, { immediate: true })

watch(homepageError, (err) => {
  if (err) {
    const status = (err as { status?: number })?.status
      || (err as { data?: { status?: number } })?.data?.status
    if (status === 401 || status === 403) {
      pb.authStore.clear()
      navigateTo('/admin')
    }
  }
})

async function handleHeroImageUpdate(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !homepageId.value)
    return
  try {
    const formData = new FormData()
    formData.append('Hero_Image', file)
    await pb.collection('Homepage')
      .update(homepageId.value, formData)
    await refreshHomepage()
    emit('showToast', 'Hero image updated successfully', 'success')
  }
  catch (err: unknown) {
    const typedErr = err as { status?: number, data?: { message?: string }, message?: string }
    if (typedErr?.status === 401 || typedErr?.status === 403) {
      emit('showToast', 'Your session has expired. Please login again.', 'error')
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    emit('showToast', `Failed to update hero image: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
  }
}

async function handleHeroImageMobileUpdate(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !homepageId.value)
    return
  try {
    const formData = new FormData()
    formData.append('Hero_Image_Mobile', file)
    await pb.collection('Homepage')
      .update(homepageId.value, formData)
    await refreshHomepage()
    emit('showToast', 'Mobile hero image updated successfully', 'success')
  }
  catch (err: unknown) {
    const typedErr = err as { status?: number, data?: { message?: string }, message?: string }
    if (typedErr?.status === 401 || typedErr?.status === 403) {
      emit('showToast', 'Your session has expired. Please login again.', 'error')
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    emit('showToast', `Failed to update mobile hero image: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
  }
}

function handleTitleClick() {
  tempTitle.value = heroTitle.value
  isEditingTitle.value = true
}

async function handleTitleSave() {
  if (!homepageId.value || tempTitle.value.trim() === heroTitle.value) {
    isEditingTitle.value = false
    return
  }
  try {
    await pb.collection('Homepage')
      .update(homepageId.value, { Hero_Title: tempTitle.value.trim() })
    heroTitle.value = tempTitle.value.trim()
    isEditingTitle.value = false
    emit('showToast', 'Hero title updated successfully', 'success')
  }
  catch (err: unknown) {
    const typedErr = err as { status?: number, data?: { message?: string }, message?: string }
    if (typedErr?.status === 401 || typedErr?.status === 403) {
      emit('showToast', 'Your session has expired. Please login again.', 'error')
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    emit('showToast', `Failed to update hero title: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
    isEditingTitle.value = false
  }
}

function handleTitleCancel() {
  isEditingTitle.value = false
  tempTitle.value = ''
}
</script>

<template>
  <div
    v-if="heroImage || heroImageMobile"
    ref="heroContainerRef"
    class="mb-12"
  >
    <div class="flex gap-6">
      <div :style="{ width: showMobilePreview ? '66.67%' : '100%', transition: 'width 0.3s ease-out', flexShrink: 0 }">
        <div
          class="preview-container bg-elevated border-default group relative w-full overflow-hidden border"
        >
          <img
            :src="heroImage"
            alt="Hero Desktop"
            class="absolute inset-0 h-full w-full object-cover"
          >

          <template v-if="heroTitle">
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div class="px-6 text-center">
                <button
                  :contenteditable="isEditingTitle"
                  class="admin-title pointer-events-auto inline-block text-4xl leading-none text-white uppercase outline-none"
                  :class="[
                    isEditingTitle ? 'cursor-text' : 'cursor-pointer transition-opacity hover:opacity-80',
                  ]"
                  :title="!isEditingTitle ? 'Click to edit' : undefined"
                  @click="!isEditingTitle && handleTitleClick()"
                  @keydown.enter.prevent="handleTitleSave"
                  @keydown.escape.prevent="handleTitleCancel"
                >
                  {{ heroTitle }}
                </button>
              </div>
            </div>
            <div
              v-if="isEditingTitle"
              class="pointer-events-none absolute right-6 bottom-6 z-10 flex gap-2"
            >
              <UButton
                color="neutral"
                variant="outline"
                size="sm"
                icon="i-ph-x"
                class="pointer-events-auto"
                title="Cancel"
                @click="handleTitleCancel"
              />
              <UButton
                variant="outline"
                color="neutral"
                size="sm"
                icon="i-ph-check"
                class="pointer-events-auto"
                title="Save"
                @click="handleTitleSave"
              />
            </div>
          </template>

          <div
            v-if="!isEditingTitle"
            class="group/update pointer-events-auto absolute right-0 bottom-0 p-6"
          >
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              icon="i-ph-image"
              class="opacity-0 transition-all group-hover/update:opacity-100"
              title="Update Desktop Hero"
              @click="heroFileInput?.click()"
            />
          </div>
        </div>
      </div>

      <div
        :style="{
          width: showMobilePreview ? 'calc(33.33% - 24px)' : '0%',
          opacity: showMobilePreview ? 1 : 0,
          overflow: 'hidden',
          transition: 'width 0.3s ease-out, opacity 0.3s ease-out',
          flexShrink: 0,
        }"
      >
        <div
          class="preview-container bg-elevated border-default group relative w-full overflow-hidden border"
        >
          <img
            :src="heroImageMobile"
            alt="Hero Mobile"
            class="absolute inset-0 h-full w-full object-cover"
          >

          <div
            v-if="!isEditingTitle"
            class="group/update pointer-events-auto absolute right-0 bottom-0 p-6"
          >
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              icon="i-ph-image"
              class="opacity-0 transition-all group-hover/update:opacity-100"
              title="Update Mobile Hero"
              @click="heroMobileFileInput?.click()"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="heroImageMobile"
      class="mt-3 flex items-center gap-3"
    >
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        class="text-xs tracking-wide uppercase"
        @click="showMobilePreview = !showMobilePreview"
      >
        {{ showMobilePreview ? 'Hide mobile preview' : 'Show mobile preview' }}
      </UButton>
      <span class="text-dimmed text-xs">
        (or swipe left/right)
      </span>
    </div>

    <input
      id="heroFileInput"
      ref="heroFileInput"
      type="file"
      accept="image/*"
      class="hidden"
      aria-label="Update Desktop Hero Image"
      @change="handleHeroImageUpdate"
    >
    <input
      id="heroMobileFileInput"
      ref="heroMobileFileInput"
      type="file"
      accept="image/*"
      class="hidden"
      aria-label="Update Mobile Hero Image"
      @change="handleHeroImageMobileUpdate"
    >
  </div>
</template>

<style scoped>
.admin-title {
  font-family: 'EnduroWeb', sans-serif;
  letter-spacing: 0.03em;
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: center;
  display: inline-block;
}

.preview-container {
  height: 680px;
}
</style>
