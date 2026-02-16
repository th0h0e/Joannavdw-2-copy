<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'

export interface ImageItem {
  id: string
  file?: File
  url: string
  filename: string
  isExisting: boolean
}

const props = defineProps<{
  modelValue: ImageItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [images: ImageItem[]]
  'delete': [image: ImageItem]
}>()

const dropZoneRef = useTemplateRef('dropZoneRef')
const imageGridRef = useTemplateRef('imageGridRef')

const images = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

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
  emit('delete', image)
  images.value = images.value.filter(img => img.id !== image.id)
  if (!image.isExisting) {
    URL.revokeObjectURL(image.url)
  }
}
</script>

<template>
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
</template>
