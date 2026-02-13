<script setup lang="ts">
import type { PortfolioProject } from '~/plugins/pocketbase.client'
import { getImageUrl, pb } from '~/plugins/pocketbase.client'

interface ImageItem {
  id: string
  file?: File
  url: string
  filename: string
  isExisting: boolean
}

const props = defineProps<{
  project: PortfolioProject | null
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  showToast: [message: string, type: 'success' | 'error']
}>()

// Form state
const formState = reactive({
  title: props.project?.Title || '',
  description: props.project?.Description || '',
  order: props.project?.Order || 0,
  responsibilities: props.project?.Responsibility_json || props.project?.Responsibility || [] as string[],
})

const images = ref<ImageItem[]>([])
const imagesToDelete = ref<string[]>([])
const loading = ref(false)
const draggedIndex = ref<number | null>(null)
const isDraggingFile = ref(false)
const { isMobile } = useBreakpoints()

onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Initialize images from existing project
watch(() => props.project, (project) => {
  if (project && project.Images) {
    images.value = project.Images.map((filename, index) => ({
      id: `existing-${index}`,
      url: getImageUrl(project, filename),
      filename,
      isExisting: true,
    }))
  }
  // Update form state when project changes
  if (project) {
    formState.title = project.Title || ''
    formState.description = project.Description || ''
    formState.order = project.Order || 0
    formState.responsibilities = project.Responsibility_json || project.Responsibility || []
  }
}, { immediate: true })

// Display value transformer for uppercase display
const uppercaseDisplay = (value: string) => value.toUpperCase()

// Convert tag values to uppercase before adding
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

function handleFileDragEnter(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  isDraggingFile.value = true
}

function handleFileDragLeave(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  isDraggingFile.value = false
}

function handleFileDragOver(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

function handleFileDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  isDraggingFile.value = false

  const files = e.dataTransfer?.files
  if (!files || files.length === 0)
    return

  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
  const newImages: ImageItem[] = imageFiles.map((file, index) => ({
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

function handleDragStart(index: number) {
  draggedIndex.value = index
}
function handleDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (draggedIndex.value === null || draggedIndex.value === index)
    return
  const newImages = [...images.value]
  const draggedItem = newImages[draggedIndex.value]
  newImages.splice(draggedIndex.value, 1)
  newImages.splice(index, 0, draggedItem)
  images.value = newImages
  draggedIndex.value = index
}
function handleDragEnd() {
  draggedIndex.value = null
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
            // Fetch directly from PocketBase URL (no proxy needed)
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
      await $fetch(`/api/projects/${props.project.id}`, {
        method: 'PUT',
        body: formData,
        headers: { Authorization: pb.authStore.token },
      })
    }
    else {
      await $fetch('/api/projects', {
        method: 'POST',
        body: formData,
        headers: { Authorization: pb.authStore.token },
      })
    }

    emit('save')
  }
  catch (err: unknown) {
    console.error('Error saving project:', err)
    const error = err as { statusCode?: number, data?: { statusCode?: number, message?: string }, message?: string }
    const status = error?.statusCode || error?.data?.statusCode
    if (status === 401 || status === 403) {
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
    <!-- Backdrop -->
    <button
      class="fixed inset-0 bg-neutral-900/70 backdrop-blur-md z-40 transition-opacity duration-300"
      aria-label="Cancel editing"
      @click="emit('cancel')"
    />

    <!-- Project Popup Preview (only when editing on desktop) -->
    <div
      v-if="project && !isMobile"
      class="project-editor__preview absolute top-1/2"
    >
      <LazyProjectPopupPreview
        :project-title="formState.title"
        :project-description="formState.description"
        :project-responsibility="formState.responsibilities"
      />
    </div>

    <!-- Sidebar -->
    <div
      class="project-editor__sidebar fixed right-0 top-0 w-3/4 md:w-2/3 lg:w-1/2 bg-black/85 backdrop-blur-xl border-l border-neutral-700/60 shadow-2xl z-50 flex flex-col"
    >
      <UForm :state="formState" class="flex flex-col h-full" @submit="handleSubmit">
        <!-- Sticky Header -->
        <div class="flex-shrink-0 p-8 border-b border-neutral-800/60 backdrop-blur-sm">
          <h2 class="text-xl font-medium text-white tracking-tight">
            {{ project ? 'Edit Project' : 'New Project' }}
          </h2>
          <p class="text-xs text-neutral-400 mt-1 tracking-wide uppercase">
            {{ project ? 'Update project details and images' : 'Create a new portfolio project' }}
          </p>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-8 space-y-8">
          <!-- Images -->
          <div>
            <!-- eslint-disable-next-line vue-a11y/label-has-for -->
            <label class="block text-xs font-medium text-neutral-300 mb-3 uppercase tracking-wider">
              Images (Drag to reorder)

              <!-- Drag and Drop Upload Zone with Images -->
              <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -->
              <div
                class="relative border-2 border-dashed rounded-sm transition-all" :class="[
                  isDraggingFile ? 'border-white/40 bg-white/5' : 'border-neutral-700/60 bg-black/30',
                  images.length === 0 ? 'cursor-pointer hover:border-neutral-600/60 hover:bg-black/40' : '',
                ]"
                @dragenter="handleFileDragEnter"
                @dragleave="handleFileDragLeave"
                @dragover="handleFileDragOver"
                @drop="handleFileDrop"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  :style="{ pointerEvents: images.length > 0 ? 'none' : 'auto' }"
                  @change="handleImageUpload"
                >

                <!-- Empty State -->
                <div v-if="images.length === 0" class="block py-12 px-6 text-center cursor-pointer pointer-events-none">
                  <div class="flex flex-col items-center gap-3">
                    <svg
                      class="w-12 h-12 transition-colors" :class="[isDraggingFile ? 'text-white' : 'text-neutral-500']"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" :stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium transition-colors uppercase tracking-wide" :class="[isDraggingFile ? 'text-white' : 'text-neutral-300']">
                        {{ isDraggingFile ? 'Drop images here' : 'Drag & drop images' }}
                      </p>
                      <p class="text-xs text-neutral-500 mt-1 tracking-wide">
                        or click to browse
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Image Grid -->
                <div v-if="images.length > 0" class="p-4">
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -->
                    <div
                      v-for="(image, index) in images"
                      :key="image.id"
                      draggable="true"
                      class="relative group cursor-move border rounded-sm overflow-hidden hover:border-neutral-600 transition-all" :class="[
                        draggedIndex === index ? 'border-neutral-500 opacity-50' : 'border-neutral-700/60',
                      ]"
                      role="button"
                      tabindex="0"
                      @dragstart="handleDragStart(index)"
                      @dragover="handleDragOver($event, index)"
                      @dragend="handleDragEnd"
                    >
                      <div class="aspect-square bg-black/50">
                        <img :src="image.url" :alt="image.filename" class="w-full h-full object-cover">
                      </div>
                      <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-sm text-xs font-medium">
                        {{ index + 1 }}
                      </div>
                      <UButton
                        type="button"
                        color="error"
                        variant="soft"
                        size="xs"
                        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all"
                        @click="handleDeleteImage(image)"
                      >
                        Delete
                      </UButton>
                      <div class="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white px-2 py-1.5 text-xs truncate">
                        {{ image.filename }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>

          <!-- Divider -->
          <div class="border-t border-white/10" />

          <!-- Title -->
          <UFormField label="Project Title" required>
            <UInput
              v-model="formState.title"
              placeholder="e.g., Maria Bodil for Nike"
              color="neutral"
              variant="subtle"
              class="w-full"
            />
          </UFormField>

          <!-- Description -->
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

          <!-- Order -->
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

          <!-- Responsibilities -->
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

        <!-- Sticky Footer -->
        <div class="flex-shrink-0 p-8 border-t border-neutral-800/60 flex gap-3 backdrop-blur-sm">
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

<style scoped>
.project-editor__preview {
  left: 25%;
  transform: translate(-50%, -50%);
  z-index: 45;
  pointer-events: none;
}

.project-editor__sidebar {
  font-family: 'EnduroWeb, sans-serif';
  height: 100vh;
}
</style>
