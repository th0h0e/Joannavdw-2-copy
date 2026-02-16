<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import type { TableColumn } from '@nuxt/ui'
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
      h('svg', {
        class: 'size-5',
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
      }, [
        h('path', { d: 'M9 4h2v2H9zm4 0h2v2h-2zM9 8h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z' }),
      ]),
    ]),
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
  <div class="border-default border">
    <div class="overflow-x-auto">
      <UTable
        :data="localProjects"
        :columns="columns"
        sticky
        :ui="{
          root: 'border-0 min-w-[600px]',
          tbody: 'project-table-tbody',
          tr: 'hover:bg-elevated/50 transition-colors',
        }"
        class="flex-1"
      />
    </div>

    <div class="border-default flex items-center justify-between border-t px-4 py-3">
      <UButton
        to="/"
        variant="ghost"
        color="neutral"
        size="sm"
        class="text-xs tracking-wide uppercase"
      >
        View Portfolio
      </UButton>

      <div class="flex items-center gap-3">
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-ph-gear"
          aria-label="Settings"
          @click="emit('openSettings')"
        />
        <UColorModeSwitch />
      </div>
    </div>
  </div>
</template>
