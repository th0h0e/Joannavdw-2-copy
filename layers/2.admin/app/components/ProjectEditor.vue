<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import { getImageUrl, pb } from '#layers/2.admin/app/utils/pocketbase'
import { useDropZone, useScrollLock } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'

interface ImageItem {
  id: string
  file?: File
  url: string
  filename: string
  isExisting: boolean
}

const props = defineProps<{
  project: PortfolioProjectsResponse<string[]> | null
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  showToast: [message: string, type: 'success' | 'error']
}>()

const formState = reactive({
  title: props.project?.Title ?? '',
  description: props.project?.Description ?? '',
  order: props.project?.Order ?? 0,
  responsibilities: props.project?.Responsibility_json ?? [],
})

const images = ref<ImageItem[]>([])
const imagesToDelete = ref<string[]>([])
const loading = ref(false)
const { isMobile } = useDevice()

const scrollLock = useScrollLock(document.body, true)

onUnmounted(() => {
  scrollLock.value = false
  images.value.forEach((img) => {
    if (!img.isExisting) {
      URL.revokeObjectURL(img.url)
    }
  })
})

const dropZoneRef = useTemplateRef('dropZoneRef')
const imageGridRef = useTemplateRef('imageGridRef')

watch(() => props.project, (project) => {
  if (project && project.Images) {
    images.value = project.Images.map((filename, index) => ({
      id: `existing-${index}`,
      url: getImageUrl(project, filename),
      filename,
      isExisting: true,
    }))
  }
  if (project) {
    formState.title = project.Title ?? ''
    formState.description = project.Description ?? ''
    formState.order = project.Order ?? 0
    formState.responsibilities = project.Responsibility_json ?? []
  }
}, { immediate: true })

useSortable(imageGridRef, images, {
  animation: 150,
})

const { isOverDropZone: isDraggingFile } = useDropZone(dropZoneRef, {
  onDrop: (files) => {
    if (!files)
      return
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    const newImages: ImageItem[] = imageFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      filename: file.name,
      isExisting: false,
    }))
    images.value = [...images.value, ...newImages]
  },
  dataTypes: ['image/*'],
  multiple: true,
})

const uppercaseDisplay = (value: string) => value.toUpperCase()

function handleAddTag(value: string) {
  return value.toUpperCase()
}

function handleImageUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files)
    return

  const newImages: ImageItem[] = Array.from(files)
    .map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      filename: file.name,
      isExisting: false,
    }))

  images.value = [...images.value, ...newImages]
}

function handleDeleteImage(image: ImageItem) {
  if (image.isExisting) {
    imagesToDelete.value.push(image.filename)
  }
  images.value = images.value.filter(img => img.id !== image.id)
  if (!image.isExisting) {
    URL.revokeObjectURL(image.url)
  }
}

async function handleSubmit(e?: Event) {
  e?.preventDefault()
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('Title', formState.title)
    formData.append('Description', formState.description)
    formData.append('Order', formState.order.toString())

    formState.responsibilities.forEach((resp: string) => {
      formData.append('Responsibility_json', resp)
    })

    if (props.project && images.value.length > 0) {
      if (props.project.Images && props.project.Images.length > 0) {
        props.project.Images.forEach((filename) => {
          formData.append('Images-', filename)
        })
      }

      for (const img of images.value) {
        if (img.file) {
          formData.append('Images', img.file)
        }
        else if (img.isExisting) {
          try {
            const response = await fetch(img.url)
            if (!response.ok)
              throw new Error(`HTTP ${response.status}`)
            const blob = await response.blob()
            const file = new File([blob], img.filename, { type: blob.type })
            formData.append('Images', file)
          }
          catch (error) {
            console.error('Error downloading existing image:', error)
            throw new Error(`Failed to download image: ${img.filename}`)
          }
        }
      }
    }
    else {
      images.value.forEach((img) => {
        if (img.file) {
          formData.append('Images', img.file)
        }
      })
    }

    if (props.project) {
      await pb.collection('Portfolio_Projects')
        .update(props.project.id, formData)
    }
    else {
      await pb.collection('Portfolio_Projects')
        .create(formData)
    }

    emit('save')
  }
  catch (err: unknown) {
    console.error('Error saving project:', err)
    const error = err as { status?: number, data?: { message?: string }, message?: string }
    if (error?.status === 401 || error?.status === 403) {
      emit('showToast', 'Your session has expired. Please login again.', 'error')
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    emit('showToast', `Failed to save project: ${error?.data?.message || error?.message || 'Unknown error'}`, 'error')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <button
      class="bg-default/70 fixed inset-0 z-40 m-0 appearance-none border-0 bg-transparent p-0 text-left backdrop-blur-md transition-opacity duration-300"
      aria-label="Cancel editing"
      @click="emit('cancel')"
    />

    <div
      v-if="project && !isMobile"
      class="pointer-events-none absolute top-1/2 left-[25%] z-45 -translate-x-1/2 -translate-y-1/2"
    >
      <LazyProjectPopupPreview
        :project-title="formState.title"
        :project-description="formState.description"
        :project-responsibility="formState.responsibilities"
      />
    </div>

    <div
      class="bg-elevated border-default fixed top-0 right-0 z-50 flex h-screen w-3/4 flex-col border-l font-['EnduroWeb',sans-serif] shadow-2xl backdrop-blur-xl md:w-2/3 lg:w-1/2"
    >
      <UForm
        :state="formState"
        class="flex h-full flex-col"
        @submit="handleSubmit"
      >
        <div class="border-default flex-shrink-0 border-b p-8 backdrop-blur-sm">
          <h2 class="text-highlighted text-xl font-medium tracking-tight">
            {{ project ? 'Edit Project' : 'New Project' }}
          </h2>
          <p class="text-muted mt-1 text-xs tracking-wide uppercase">
            {{ project ? 'Update project details and images' : 'Create a new portfolio project' }}
          </p>
        </div>

        <div class="flex-1 space-y-8 overflow-y-auto p-8">
          <div>
            <span
              id="images-label"
              class="text-toned mb-3 block text-xs font-medium tracking-wider uppercase"
            >
              Images (Drag to reorder)
            </span>

            <div
              ref="dropZoneRef"
              class="relative border-2 border-dashed transition-all"
              :class="[
                isDraggingFile ? 'border-primary bg-primary/5' : 'border-default bg-elevated/50',
                images.length === 0 ? 'hover:border-accented hover:bg-elevated cursor-pointer' : '',
              ]"
              role="button"
              tabindex="0"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                aria-labelledby="images-label"
                class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                :style="{ pointerEvents: images.length > 0 ? 'none' : 'auto' }"
                @change="handleImageUpload"
              >

              <div
                v-if="images.length === 0"
                class="pointer-events-none block cursor-pointer px-6 py-12 text-center"
              >
                <div class="flex flex-col items-center gap-3">
                  <UIcon
                    name="i-ph-upload"
                    class="size-12 transition-colors"
                    :class="[isDraggingFile ? 'text-primary' : 'text-muted']"
                  />
                  <div>
                    <p
                      class="text-sm font-medium tracking-wide uppercase transition-colors"
                      :class="[isDraggingFile ? 'text-primary' : 'text-toned']"
                    >
                      {{ isDraggingFile ? 'Drop images here' : 'Drag & drop images' }}
                    </p>
                    <p class="text-dimmed mt-1 text-xs tracking-wide">
                      or click to browse
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-if="images.length > 0"
                class="p-4"
              >
                <div
                  ref="imageGridRef"
                  class="grid grid-cols-2 gap-3 md:grid-cols-3"
                >
                  <div
                    v-for="(image, index) in images"
                    :key="image.id"
                    class="image-item group border-default hover:border-accented relative cursor-move overflow-hidden border transition-all"
                    role="button"
                    tabindex="0"
                  >
                    <div class="bg-elevated aspect-square">
                      <img
                        :src="image.url"
                        :alt="image.filename"
                        class="h-full w-full object-cover"
                      >
                    </div>
                    <div class="bg-default/60 text-highlighted absolute top-2 left-2 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                      {{ index + 1 }}
                    </div>
                    <UButton
                      type="button"
                      color="error"
                      variant="soft"
                      size="xs"
                      icon="i-ph-trash"
                      class="absolute top-2 right-2 opacity-0 transition-all group-hover:opacity-100"
                      @click="handleDeleteImage(image)"
                    >
                      Delete
                    </UButton>
                    <div class="bg-default/60 text-highlighted absolute right-0 bottom-0 left-0 truncate px-2 py-1.5 text-xs backdrop-blur-sm">
                      {{ image.filename }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-default border-t" />

          <UFormField
            label="Project Title"
            required
          >
            <UInput
              v-model="formState.title"
              placeholder="e.g., Maria Bodil for Nike"
              color="neutral"
              variant="subtle"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Description"
            required
          >
            <UTextarea
              v-model="formState.description"
              :rows="6"
              placeholder="Project description..."
              color="neutral"
              variant="subtle"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Position in Portfolio"
            required
          >
            <UInputNumber
              v-model="formState.order"
              :min="0"
              :increment="false"
              :decrement="false"
              color="neutral"
              variant="subtle"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Responsibilities"
            help="Press Enter to add a responsibility"
          >
            <UInputTags
              v-model="formState.responsibilities"
              placeholder="e.g., CREATIVE PRODUCTION"
              color="neutral"
              variant="subtle"
              :display-value="uppercaseDisplay"
              :convert-value="handleAddTag"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="border-default flex flex-shrink-0 gap-3 border-t p-8 backdrop-blur-sm">
          <UButton
            type="button"
            variant="outline"
            color="neutral"
            class="flex-1"
            @click="emit('cancel')"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="loading"
            class="flex-1"
          >
            {{ loading ? 'Saving...' : project ? 'Update Project' : 'Create Project' }}
          </UButton>
        </div>
      </UForm>
    </div>
  </Teleport>
</template>
