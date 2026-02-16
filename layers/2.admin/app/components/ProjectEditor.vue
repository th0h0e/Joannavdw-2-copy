<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import { getImageUrl, pb } from '#layers/2.admin/app/utils/pocketbase'

interface NewImage {
  id: string
  file: File
  url: string
  filename: string
}

const props = defineProps<{
  project: PortfolioProjectsResponse<string[]> | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  showToast: [message: string, type: 'success' | 'error']
}>()

const { isMobile } = useDevice()

// Local open state that syncs with prop
const open = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value)
      emit('cancel')
  },
})

const formState = reactive({
  title: '',
  description: '',
  order: 0,
  responsibilities: [] as string[],
})

const newImages = ref<NewImage[]>([])
const loading = ref(false)

// Carousel items - combines existing project images with newly uploaded ones
const carouselItems = computed(() => {
  const existing = props.project?.Images?.map((filename, index) => ({
    id: `existing-${index}`,
    src: getImageUrl(props.project!, filename),
    filename,
    isNew: false,
  })) || []

  const newItems = newImages.value.map(img => ({
    id: img.id,
    src: img.url,
    filename: img.filename,
    isNew: true,
  }))

  return [...existing, ...newItems]
})

watch(() => props.project, (project) => {
  if (project) {
    formState.title = project.Title ?? ''
    formState.description = project.Description ?? ''
    formState.order = project.Order ?? 0
    formState.responsibilities = project.Responsibility_json ?? []
  }
  else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  newImages.value = []
  formState.title = ''
  formState.description = ''
  formState.order = 0
  formState.responsibilities = []
}

function handleClose() {
  // Clean up object URLs
  newImages.value.forEach((img) => {
    URL.revokeObjectURL(img.url)
  })
  resetForm()
  emit('cancel')
}

function handleFilesAdded(files: File[] | File) {
  const fileArray = Array.isArray(files) ? files : [files]
  const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))

  const imagesToAdd: NewImage[] = imageFiles.map((file, index) => ({
    id: `new-${Date.now()}-${index}`,
    file,
    url: URL.createObjectURL(file),
    filename: file.name,
  }))

  newImages.value = [...newImages.value, ...imagesToAdd]
}

async function handleSubmit() {
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('Title', formState.title)
    formData.append('Description', formState.description)
    formData.append('Order', formState.order.toString())

    formState.responsibilities.forEach((resp) => {
      formData.append('Responsibility_json', resp)
    })

    // Keep existing images (PocketBase uses Images- prefix to keep existing)
    if (props.project?.Images && props.project.Images.length > 0) {
      props.project.Images.forEach((filename) => {
        formData.append('Images-', filename)
      })
    }

    // Add new images
    newImages.value.forEach((img) => {
      formData.append('Images', img.file)
    })

    if (props.project) {
      await pb.collection('Portfolio_Projects')
        .update(props.project.id, formData)
    }
    else {
      await pb.collection('Portfolio_Projects')
        .create(formData)
    }

    emit('save')
    resetForm()
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

const uppercaseDisplay = (value: string) => value.toUpperCase()

function handleAddTag(value: string) {
  return value.toUpperCase()
}
</script>

<template>
  <UDrawer
    v-model:open="open"
    :title="project ? 'Edit Project' : 'New Project'"
    :description="project ? 'Update project details and images' : 'Create a new portfolio project'"
    :direction="isMobile ? 'bottom' : 'right'"
    :handle="isMobile"
    :ui="{
      content: isMobile
        ? 'h-[90vh] max-h-[90vh] rounded-t-2xl'
        : 'h-full w-full md:w-2/3 lg:w-1/2 max-w-none',
      body: 'p-0 overflow-y-auto',
      header: 'p-6 border-b border-default flex-shrink-0',
    }"
  >
    <template #body>
      <div class="flex flex-col">
        <!-- Image Carousel (Mobile: shows partial next image to suggest scroll) -->
        <div
          v-if="carouselItems.length > 0"
          class="border-default border-b"
        >
          <UCarousel
            :items="carouselItems"
            class="w-full"
            :ui="isMobile ? {
              item: 'basis-[85%] snap-center pl-2',
              viewport: 'aspect-square',
            } : {
              item: 'basis-full snap-center',
              viewport: 'aspect-square',
            }"
          >
            <template #default="{ item }">
              <img
                :src="item.src"
                :alt="item.filename"
                class="size-full object-cover"
              >
            </template>
          </UCarousel>
        </div>

        <!-- Image Upload (Mobile: below carousel) -->
        <div
          v-if="isMobile"
          class="border-default border-b p-4"
        >
          <UFileUpload
            :model-value="null"
            accept="image/*"
            multiple
            variant="button"
            label="Add Images"
            icon="i-ph-plus"
            color="neutral"
            class="w-full"
            @update:model-value="handleFilesAdded"
          />
        </div>

        <!-- Form -->
        <UForm
          :state="formState"
          class="flex-1 space-y-6 p-6"
          @submit="handleSubmit"
        >
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
              :rows="isMobile ? 8 : 4"
              placeholder="Project description..."
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

          <!-- Image Upload (Desktop: in form) -->
          <div v-if="!isMobile">
            <p class="text-toned mb-3 text-xs font-medium tracking-wider uppercase">
              Add More Images
            </p>
            <UFileUpload
              :model-value="null"
              accept="image/*"
              multiple
              variant="button"
              label="Upload Images"
              icon="i-ph-upload"
              color="neutral"
              class="w-full"
              @update:model-value="handleFilesAdded"
            />
            <p class="text-dimmed mt-2 text-xs">
              New images will be added at the end
            </p>
          </div>
        </UForm>

        <!-- Actions -->
        <div class="border-default flex flex-shrink-0 gap-3 border-t p-6">
          <UButton
            type="button"
            variant="outline"
            color="neutral"
            class="flex-1"
            @click="handleClose"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            variant="outline"
            color="neutral"
            :loading="loading"
            class="flex-1"
            @click="handleSubmit"
          >
            {{ loading ? 'Saving...' : project ? 'Update' : 'Create' }}
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>
