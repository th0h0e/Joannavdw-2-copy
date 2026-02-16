<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import type { TableColumn } from '@nuxt/ui'
import { getImageUrl } from '#layers/2.admin/app/utils/pocketbase'
import { useSortable } from '@vueuse/integrations/useSortable'

const props = defineProps<{
  projects: PortfolioProjectsResponse<string[]>[]
}>()

const emit = defineEmits<{
  edit: [project: PortfolioProjectsResponse<string[]>]
  delete: [projectId: string]
  reorder: [projects: PortfolioProjectsResponse<string[]>[]]
  openSettings: []
}>()

const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')

const localProjects = ref<PortfolioProjectsResponse<string[]>[]>([])

watch(() => props.projects, (val) => {
  localProjects.value = [...val]
}, { immediate: true })

useSortable('.project-table-tbody', localProjects, {
  animation: 150,
  handle: '.drag-handle',
  onEnd: () => {
    emit('reorder', [...localProjects.value])
  },
})

const columns: TableColumn<PortfolioProjectsResponse<string[]>>[] = [
  {
    id: 'drag',
    enableSorting: false,
    enableHiding: false,
    meta: {
      class: {
        th: 'w-10',
        td: 'w-10',
      },
    },
    cell: () => h('div', {
      class: 'drag-handle text-muted hover:text-toned flex cursor-grab items-center justify-center py-2 transition-colors active:cursor-grabbing',
    }, [
      h(UIcon, {
        name: 'i-ph-dots-six-vertical',
        class: 'size-5',
      }),
    ]),
  },
  {
    id: 'thumbnail',
    header: 'Image',
    enableSorting: false,
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20',
      },
    },
    cell: ({ row }) => {
      const imageCount = row.original.Images?.length || 0
      if (imageCount > 0) {
        return h('div', { class: 'bg-elevated relative size-12 overflow-hidden' }, [
          h('img', {
            src: getImageUrl(row.original, row.original.Images[0]),
            alt: row.original.Title,
            class: 'size-full object-cover',
          }),
          h('div', {
            class: 'bg-default/70 text-highlighted absolute right-1 bottom-1 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm',
          }, imageCount),
        ])
      }
      return h('div', { class: 'bg-elevated flex size-12 items-center justify-center' }, [
        h('span', { class: 'text-dimmed text-xs' }, '–'),
      ])
    },
  },
  {
    accessorKey: 'Title',
    header: 'Title',
    cell: ({ row }) => h('span', { class: 'text-highlighted font-medium' }, row.original.Title),
  },
  {
    id: 'responsibilities',
    header: 'Responsibilities',
    enableSorting: false,
    meta: {
      class: {
        td: 'max-w-xs',
      },
    },
    cell: ({ row }) => {
      const responsibilities = row.original.Responsibility_json || row.original.Responsibility || []
      if (responsibilities.length === 0)
        return h('span', { class: 'text-dimmed text-xs' }, '–')

      return h('div', { class: 'flex flex-wrap gap-1' }, responsibilities.map((resp: string) =>
        h('span', {
          class: 'bg-elevated border-default text-toned border px-1 py-0 text-[10px] font-medium tracking-wide uppercase',
        }, resp)))
    },
  },
  {
    id: 'edit',
    enableSorting: false,
    enableHiding: false,
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20',
      },
    },
    cell: ({ row }) => h(UButton, {
      variant: 'outline',
      color: 'neutral',
      size: 'sm',
      class: 'text-xs tracking-wide uppercase',
      onClick: () => emit('edit', row.original),
    }, () => 'Edit'),
  },
  {
    id: 'delete',
    enableSorting: false,
    enableHiding: false,
    meta: {
      class: {
        th: 'w-24',
        td: 'w-24',
      },
    },
    cell: ({ row }) => h(UButton, {
      color: 'error',
      variant: 'soft',
      size: 'sm',
      class: 'text-xs tracking-wide uppercase',
      onClick: () => emit('delete', row.original.id),
    }, () => 'Delete'),
  },
]
</script>

<template>
  <UTable
    :data="localProjects"
    :columns="columns"
    sticky
    :ui="{
      root: 'border-default border',
      tbody: 'project-table-tbody',
      tr: 'hover:bg-elevated/50 transition-colors',
    }"
    class="flex-1"
  >
    <template #footer>
      <div class="flex items-center justify-end gap-3 px-4 py-3">
        <UButton
          to="/"
          variant="ghost"
          color="neutral"
          size="sm"
          class="text-xs tracking-wide uppercase"
        >
          View Portfolio
        </UButton>
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-ph-gear"
          aria-label="Settings"
          @click="emit('openSettings')"
        />
        <UColorModeButton />
      </div>
    </template>
  </UTable>
</template>
