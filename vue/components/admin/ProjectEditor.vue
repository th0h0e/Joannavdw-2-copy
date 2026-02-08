<script setup lang="ts">
import type { PortfolioProject } from '@/plugins/pocketbase'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import pb, { getImageUrl } from '@/plugins/pocketbase'
import ProjectPopupPreview from './ProjectPopupPreview.vue'

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

const title = ref(props.project?.Title || '')
const description = ref(props.project?.Description || '')
const order = ref(props.project?.Order || 0)
const responsibilities = ref<string[]>(props.project?.Responsibility_json || props.project?.Responsibility || [])
const newResponsibility = ref('')
const images = ref<ImageItem[]>([])
const imagesToDelete = ref<string[]>([])
const loading = ref(false)
const draggedIndex = ref<number | null>(null)
const isDraggingFile = ref(false)
const isMobile = ref(window.innerWidth < 768)

function handleResize() {
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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
}, { immediate: true })

function handleAddResponsibility() {
  if (newResponsibility.value.trim()) {
    responsibilities.value.push(newResponsibility.value.trim().toUpperCase())
    newResponsibility.value = ''
  }
}

function handleRemoveResponsibility(index: number) {
  responsibilities.value = responsibilities.value.filter((_, i) => i !== index)
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

async function handleSubmit(e: Event) {
  e.preventDefault()
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('Title', title.value)
    formData.append('Description', description.value)
    formData.append('Order', order.value.toString())

    responsibilities.value.forEach((resp) => {
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
    const error = err as { status?: number, message?: string }
    if (error?.status === 401 || error?.status === 403) {
      emit('showToast', 'Your session has expired. Please login again.', 'error')
      pb.authStore.clear()
      window.location.href = '/admin'
      return
    }
    emit('showToast', `Failed to save project: ${error?.message || 'Unknown error'}`, 'error')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-neutral-900/70 backdrop-blur-md z-40 transition-opacity duration-300"
      @click="emit('cancel')"
    />

    <!-- Project Popup Preview (only when editing on desktop) -->
    <div
      v-if="project && !isMobile"
      class="absolute top-1/2"
      :style="{ left: '25%', transform: 'translate(-50%, -50%)', zIndex: 45, pointerEvents: 'none' }"
    >
      <ProjectPopupPreview
        :project-title="title"
        :project-description="description"
        :project-responsibility="responsibilities"
      />
    </div>

    <!-- Sidebar -->
    <div
      class="fixed right-0 top-0 w-3/4 md:w-2/3 lg:w-1/2 bg-black/85 backdrop-blur-xl border-l border-neutral-700/60 shadow-2xl z-50 flex flex-col"
      :style="{ fontFamily: 'EnduroWeb, sans-serif', height: '100vh' }"
    >
      <form class="flex flex-col h-full" @submit="handleSubmit">
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
            <label class="block text-xs font-medium text-neutral-300 mb-3 uppercase tracking-wider">
              Images (Drag to reorder)
            </label>

            <!-- Drag and Drop Upload Zone with Images -->
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
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                :style="{ pointerEvents: images.length > 0 ? 'none' : 'auto' }"
                @change="handleImageUpload"
              >

              <!-- Empty State -->
              <label v-if="images.length === 0" for="image-upload" class="block py-12 px-6 text-center cursor-pointer">
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
                    <p class="text-xs text-neutral-500 mt-1 tracking-wide">or click to browse</p>
                  </div>
                </div>
              </label>

              <!-- Image Grid -->
              <div v-if="images.length > 0" class="p-4">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    v-for="(image, index) in images"
                    :key="image.id"
                    draggable="true"
                    class="relative group cursor-move border rounded-sm overflow-hidden hover:border-neutral-600 transition-all" :class="[
                      draggedIndex === index ? 'border-neutral-500 opacity-50' : 'border-neutral-700/60',
                    ]"
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
                    <button
                      type="button"
                      class="absolute top-2 right-2 bg-red-600/10 backdrop-blur-md text-red-400 px-2.5 py-1 rounded-sm text-xs hover:bg-red-600/20 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all font-medium uppercase tracking-wide border border-red-600/20 hover:border-red-600/30"
                      @click="handleDeleteImage(image)"
                    >
                      Delete
                    </button>
                    <div class="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white px-2 py-1.5 text-xs truncate">
                      {{ image.filename }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-white/10" />

          <!-- Title -->
          <div>
            <label for="title" class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">
              Project Title *
            </label>
            <input
              id="title"
              v-model="title"
              type="text"
              required
              class="w-full px-4 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
              placeholder="e.g., Maria Bodil for Nike"
            >
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">
              Description *
            </label>
            <textarea
              id="description"
              v-model="description"
              required
              :rows="6"
              class="w-full px-4 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all resize-none"
              placeholder="Project description..."
            />
          </div>

          <!-- Order -->
          <div>
            <label for="order" class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">
              Position in Portfolio *
            </label>
            <input
              id="order"
              v-model.number="order"
              type="number"
              required
              min="0"
              class="w-full px-4 py-3 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 text-sm transition-all"
            >
          </div>

          <!-- Responsibilities -->
          <div>
            <label class="block text-xs font-medium text-neutral-300 mb-2 uppercase tracking-wider">
              Responsibilities
            </label>
            <div class="flex gap-2 mb-3">
              <input
                v-model="newResponsibility"
                type="text"
                class="flex-1 px-4 py-2.5 bg-black/30 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-neutral-500 text-sm transition-all"
                placeholder="e.g., CREATIVE PRODUCTION"
                @keypress.enter.prevent="handleAddResponsibility"
              >
              <button
                type="button"
                class="px-6 py-3 bg-white text-black rounded-sm text-sm hover:bg-neutral-100 font-medium transition-all uppercase tracking-wide"
                @click="handleAddResponsibility"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(resp, idx) in responsibilities"
                :key="`${resp}-${idx}`"
                class="inline-flex items-center gap-2 bg-black/30 border border-neutral-700/40 text-neutral-200 px-3 py-1.5 rounded-sm text-xs tracking-wide"
              >
                {{ resp }}
                <button
                  type="button"
                  class="text-red-400 hover:text-red-300 text-sm transition-colors"
                  @click="handleRemoveResponsibility(idx)"
                >
                  &times;
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="flex-shrink-0 p-8 border-t border-neutral-800/60 flex gap-3 backdrop-blur-sm">
          <button
            type="button"
            class="flex-1 px-6 py-3 bg-black/30 border border-neutral-700/60 text-neutral-200 rounded-sm hover:bg-black/50 hover:text-white hover:border-neutral-600/60 transition-all text-sm uppercase tracking-wide font-medium"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-white text-black rounded-sm hover:bg-neutral-100 disabled:bg-neutral-600 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all font-medium text-sm uppercase tracking-wide hover:shadow-lg hover:shadow-white/10"
          >
            {{ loading ? 'Saving...' : project ? 'Update Project' : 'Create Project' }}
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
