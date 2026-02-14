<script setup lang="ts">
import type { PortfolioProjectsResponse } from '~/shared/types/pocketbase-types'
import { useDropZone, useScrollLock } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'
import { getImageUrl, pb } from '~/utils/pocketbase'

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

useScrollLock(document.body, true)

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
  handle: '.image-item',
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

  const newImages: ImageItem[] = Array.from(files).map((file, index) => ({
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
      await pb.collection('Portfolio_Projects').update(props.project.id, formData)
    }
    else {
      await pb.collection('Portfolio_Projects').create(formData)
    }

    emit('save')
  }
  catch (err: unknown) {
    console.error('Error saving project:', err)
    const error = err as { status?: number, data?: { message?: string }, message?: string }
    if (error?.status === 401 || error?.status === 403) {
      emit('showToast', 'Your session has expired. Please login again.', 'error')
      pb.authStore.clear()
      window.location.href = '/admin'
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
      class="fixed inset-0 bg-default/70 backdrop-blur-md z-40 transition-opacity duration-300 appearance-none bg-transparent border-0 p-0 m-0 text-left"
      aria-label="Cancel editing"
      @click="emit('cancel')"
    />

    <div
      v-if="project && !isMobile"
      class="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 z-[45] pointer-events-none"
    >
      <LazyProjectPopupPreview
        :project-title="formState.title"
        :project-description="formState.description"
        :project-responsibility="formState.responsibilities"
      />
    </div>

    <div
      class="fixed right-0 top-0 w-3/4 md:w-2/3 lg:w-1/2 bg-elevated backdrop-blur-xl border-l border-default shadow-2xl z-50 flex flex-col h-screen font-['EnduroWeb',sans-serif]"
    >
      <UForm :state="formState" class="flex flex-col h-full" @submit="handleSubmit">
        <div class="flex-shrink-0 p-8 border-b border-default backdrop-blur-sm">
          <h2 class="text-xl font-medium text-highlighted tracking-tight">
            {{ project ? 'Edit Project' : 'New Project' }}
          </h2>
          <p class="text-xs text-muted mt-1 tracking-wide uppercase">
            {{ project ? 'Update project details and images' : 'Create a new portfolio project' }}
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-8 space-y-8">
          <div>
            <span id="images-label" class="block text-xs font-medium text-toned mb-3 uppercase tracking-wider">
              Images (Drag to reorder)
            </span>

            <div
              ref="dropZoneRef"
              class="relative border-2 border-dashed transition-all" :class="[
                isDraggingFile ? 'border-primary bg-primary/5' : 'border-default bg-elevated/50',
                images.length === 0 ? 'cursor-pointer hover:border-accented hover:bg-elevated' : '',
              ]"
              role="button"
              tabindex="0"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                aria-labelledby="images-label"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                :style="{ pointerEvents: images.length > 0 ? 'none' : 'auto' }"
                @change="handleImageUpload"
              >

              <div v-if="images.length === 0" class="block py-12 px-6 text-center cursor-pointer pointer-events-none">
                <div class="flex flex-col items-center gap-3">
                  <UIcon
                    name="i-ph-upload"
                    class="size-12 transition-colors"
                    :class="[isDraggingFile ? 'text-primary' : 'text-muted']"
                  />
                  <div>
                    <p class="text-sm font-medium transition-colors uppercase tracking-wide" :class="[isDraggingFile ? 'text-primary' : 'text-toned']">
                      {{ isDraggingFile ? 'Drop images here' : 'Drag & drop images' }}
                    </p>
                    <p class="text-xs text-dimmed mt-1 tracking-wide">
                      or click to browse
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="images.length > 0" class="p-4">
                <div ref="imageGridRef" class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    v-for="(image, index) in images"
                    :key="image.id"
                    class="image-item relative group cursor-move border overflow-hidden transition-all border-default hover:border-accented"
                    role="button"
                    tabindex="0"
                  >
                    <div class="aspect-square bg-elevated">
                      <img :src="image.url" :alt="image.filename" class="w-full h-full object-cover">
                    </div>
                    <div class="absolute top-2 left-2 bg-default/60 backdrop-blur-sm text-highlighted px-2 py-1 text-xs font-medium">
                      {{ index + 1 }}
                    </div>
                    <UButton
                      type="button"
                      color="error"
                      variant="soft"
                      size="xs"
                      icon="i-ph-trash"
                      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all"
                      @click="handleDeleteImage(image)"
                    >
                      Delete
                    </UButton>
                    <div class="absolute bottom-0 left-0 right-0 bg-default/60 backdrop-blur-sm text-highlighted px-2 py-1.5 text-xs truncate">
                      {{ image.filename }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-default" />

          <UFormField label="Project Title" required>
            <UInput
              v-model="formState.title"
              placeholder="e.g., Maria Bodil for Nike"
              color="neutral"
              variant="subtle"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Description" required>
            <UTextarea
              v-model="formState.description"
              :rows="6"
              placeholder="Project description..."
              color="neutral"
              variant="subtle"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Position in Portfolio" required>
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

          <UFormField label="Responsibilities" help="Press Enter to add a responsibility">
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

        <div class="flex-shrink-0 p-8 border-t border-default flex gap-3 backdrop-blur-sm">
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
