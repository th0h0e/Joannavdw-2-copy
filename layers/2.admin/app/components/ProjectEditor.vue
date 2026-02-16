<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import type { ImageItem } from './ImageDropZone.vue'
import { getImageUrl, pb } from '#layers/2.admin/app/utils/pocketbase'

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

const formState = reactive({
  title: '',
  description: '',
  order: 0,
  responsibilities: [] as string[],
})

const images = ref<ImageItem[]>([])
const imagesToDelete = ref<string[]>([])
const loading = ref(false)

watch(() => props.project, (project) => {
  if (project) {
    images.value = project.Images?.map((filename, index) => ({
      id: `existing-${index}`,
      url: getImageUrl(project, filename),
      filename,
      isExisting: true,
    })) ?? []
    formState.title = project.Title ?? ''
    formState.description = project.Description ?? ''
    formState.order = project.Order ?? 0
    formState.responsibilities = project.Responsibility_json ?? []
  }
  else {
    images.value = []
    imagesToDelete.value = []
    formState.title = ''
    formState.description = ''
    formState.order = 0
    formState.responsibilities = []
  }
}, { immediate: true })

function handleImageDelete(image: ImageItem) {
  if (image.isExisting) {
    imagesToDelete.value.push(image.filename)
  }
}

function handleClose() {
  images.value.forEach((img) => {
    if (!img.isExisting) {
      URL.revokeObjectURL(img.url)
    }
  })
  emit('cancel')
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

const uppercaseDisplay = (value: string) => value.toUpperCase()

function handleAddTag(value: string) {
  return value.toUpperCase()
}
</script>

<template>
  <UDrawer
    :open="isOpen"
    direction="right"
    :handle="false"
    :ui="{
      content: 'h-full w-3/4 md:w-2/3 lg:w-1/2 max-w-none',
      body: 'p-0',
      header: 'p-6 border-b border-default',
    }"
    @close="handleClose"
  >
    <template #header>
      <h2 class="text-highlighted text-xl font-medium tracking-tight">
        {{ project ? 'Edit Project' : 'New Project' }}
      </h2>
      <p class="text-muted mt-1 text-xs tracking-wide uppercase">
        {{ project ? 'Update project details and images' : 'Create a new portfolio project' }}
      </p>
    </template>

    <template #body>
      <UForm
        :state="formState"
        class="flex h-full flex-col"
        @submit="handleSubmit"
      >
        <div class="flex-1 space-y-6 overflow-y-auto p-6">
          <ImageDropZone
            v-model="images"
            @delete="handleImageDelete"
          />

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
          >
            {{ loading ? 'Saving...' : project ? 'Update Project' : 'Create Project' }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UDrawer>

  <Teleport to="body">
    <div
      v-if="isOpen && project && !isMobile"
      class="pointer-events-auto fixed top-1/2 left-[25%] z-[60] -translate-x-1/2 -translate-y-1/2"
    >
      <LazyProjectPopupPreview
        :project-title="formState.title"
        :project-description="formState.description"
        :project-responsibility="formState.responsibilities"
      />
    </div>
  </Teleport>
</template>
