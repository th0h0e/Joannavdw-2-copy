<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import type { TableColumn } from '@nuxt/ui'
import { getImageUrl } from '#layers/2.admin/app/utils/pocketbase'
import { useSortable } from '@vueuse/integrations/useSortable'

const props = defineProps<{
  projects: PortfolioProjectsResponse<string[]>[]
  isReordering: boolean
}>()

const emit = defineEmits<{
  edit: [project: PortfolioProjectsResponse<string[]>]
  delete: [projectId: string]
  reorder: [projects: PortfolioProjectsResponse<string[]>[]]
  refresh: []
}>()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UIcon = resolveComponent('UIcon')

const localProjects = ref<PortfolioProjectsResponse<string[]>[]>([])

watch(() => props.projects, (val) => {
  localProjects.value = [...val]
}, { immediate: true })

useSortable('.project-table-tbody', localProjects, {
  animation: 150,
  handle: '.drag-handle',
  onEnd: async () => {
    if (props.isReordering)
      return

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
        th: 'w-16',
        td: 'w-16',
      },
    },
    cell: ({ row }) => {
      if (row.original.Images && row.original.Images.length > 0) {
        return h('div', { class: 'bg-elevated relative size-12 overflow-hidden rounded' }, [
          h('img', {
            src: getImageUrl(row.original, row.original.Images[0]),
            alt: row.original.Title,
            class: 'size-full object-cover',
          }),
        ])
      }
      return h('div', { class: 'bg-elevated flex size-12 items-center justify-center rounded' }, [
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
    accessorKey: 'Description',
    header: 'Description',
    meta: {
      class: {
        td: 'max-w-xs',
      },
    },
    cell: ({ row }) => h('p', { class: 'text-muted line-clamp-2 text-sm' }, row.original.Description),
  },
  {
    id: 'images',
    header: 'Images',
    enableSorting: false,
    meta: {
      class: {
        th: 'w-20 text-center',
        td: 'w-20 text-center',
      },
    },
    cell: ({ row }) => h(UBadge, {
      color: 'neutral',
      variant: 'subtle',
      size: 'sm',
    }, () => `${row.original.Images?.length || 0}`),
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
          class: 'bg-elevated border-default text-toned border px-1.5 py-0.5 text-xs font-medium tracking-wider uppercase',
        }, resp)))
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    meta: {
      class: {
        th: 'w-24',
        td: 'w-24 text-right',
      },
    },
    cell: ({ row }) => h(UDropdownMenu, {
      content: { align: 'end' },
      items: [
        {
          label: 'Edit',
          icon: 'i-ph-pencil',
          onSelect: () => emit('edit', row.original),
        },
        {
          type: 'separator',
        },
        {
          label: 'Delete',
          icon: 'i-ph-trash',
          color: 'error',
          onSelect: () => emit('delete', row.original.id),
        },
      ],
    }, () => h(UButton, {
      'icon': 'i-ph-dots-three-vertical',
      'color': 'neutral',
      'variant': 'ghost',
      'size': 'sm',
      'aria-label': 'Actions',
    })),
  },
]
</script>

<template>
  <UTable
    :data="localProjects"
    :columns="columns"
    :ui="{
      tbody: 'project-table-tbody',
    }"
    class="flex-1"
  />
</template>
