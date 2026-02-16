<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import { getImageUrl, pb } from '#layers/2.admin/app/utils/pocketbase'
import { useSortable } from '@vueuse/integrations/useSortable'

definePageMeta({
  layout: 'admin',
})

const { showToast } = useAppToast()

const editingProject = ref<PortfolioProjectsResponse<string[]> | null>(null)
const showNewProjectForm = ref(false)
const showSettings = ref(false)
const isDeleteModalOpen = ref(false)
const projectToDelete = ref<string | null>(null)

const projectListRef = useTemplateRef('projectListRef')

const { data: rawProjects, refresh: refreshProjects, status: projectsStatus, error: projectsError } = useAsyncData(
  'admin-projects',
  () => pb.collection('Portfolio_Projects')
    .getFullList<PortfolioProjectsResponse<string[]>>({ sort: 'Order', requestKey: null }),
)

const projects = ref<PortfolioProjectsResponse<string[]>[]>([])
watch(rawProjects, (val) => {
  if (val)
    projects.value = [...val]
}, { immediate: true })

useSortable(projectListRef, projects, {
  animation: 150,
  handle: '.drag-handle',
  onEnd: async () => {
    if (isReordering.value)
      return

    isReordering.value = true
    try {
      for (const [index, project] of projects.value.entries()) {
        await pb.collection('Portfolio_Projects')
          .update(project.id, { Order: index + 1 })
      }
    }
    catch (err: unknown) {
      await refreshProjects()
      const typedErr = err as { data?: { message?: string }, message?: string }
      showToast(`Failed to reorder projects: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
    }
    finally {
      isReordering.value = false
    }
  },
})

const loading = computed(() => projectsStatus.value === 'pending')
const error = computed(() => projectsError.value ? 'Failed to load projects' : null)

watch(projectsError, (err) => {
  if (err) {
    const status = (err as { status?: number })?.status
      || (err as { data?: { status?: number } })?.data?.status
    if (status === 401 || status === 403) {
      pb.authStore.clear()
      navigateTo('/admin')
    }
  }
})

function handleLogout() {
  pb.authStore.clear()
  navigateTo('/')
}

function handleDelete(projectId: string) {
  projectToDelete.value = projectId
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!projectToDelete.value)
    return
  try {
    await pb.collection('Portfolio_Projects')
      .delete(projectToDelete.value)
    isDeleteModalOpen.value = false
    projectToDelete.value = null
    await refreshProjects()
    showToast('Project deleted successfully', 'success')
  }
  catch (err: unknown) {
    const typedErr = err as { status?: number, data?: { message?: string }, message?: string }
    if (typedErr?.status === 401 || typedErr?.status === 403) {
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    showToast(`Failed to delete project: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
    isDeleteModalOpen.value = false
    projectToDelete.value = null
  }
}

async function handleSave() {
  const isCreating = showNewProjectForm.value
  editingProject.value = null
  showNewProjectForm.value = false
  await refreshProjects()
  showToast(isCreating ? 'Project created successfully' : 'Project updated successfully', 'success')
}

function handleReorder(reorderedProjects: PortfolioProjectsResponse<string[]>[]) {
  projects.value = reorderedProjects
}

async function handlePublishChanges() {
  try {
    for (const [index, project] of projects.value.entries()) {
      await pb.collection('Portfolio_Projects')
        .update(project.id, { Order: index + 1 })
    }

    await $fetch('/api/revalidate', {
      method: 'POST',
      body: {
        collections: ['About', 'Homepage', 'Portfolio_Projects'],
      },
      headers: { Authorization: `Bearer ${pb.authStore.token}` },
    })
    showToast('Changes published successfully!', 'success')
  }
  catch (err: unknown) {
    const typedErr = err as { data?: { message?: string }, message?: string }
    showToast(`Failed to publish: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
  }
}
</script>

<template>
  <div
    v-if="loading"
    class="bg-default flex min-h-screen items-center justify-center"
  >
    <div class="text-highlighted text-xl">
      Loading...
    </div>
  </div>

  <div
    v-else
    class="admin-container bg-default min-h-screen"
  >
    <header class="border-default bg-default/80 sticky top-0 z-10 border-b backdrop-blur-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div>
          <h1 class="text-highlighted text-xl font-medium tracking-tight">
            Portfolio
          </h1>
          <p class="text-muted mt-1 text-xs tracking-wide">
            {{ projects.length }} {{ projects.length === 1 ? 'project' : 'projects' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-ph-cloud-arrow-up"
            class="text-xs tracking-wide uppercase"
            @click="handlePublishChanges"
          >
            Publish Changes
          </UButton>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            class="text-xs tracking-wide uppercase"
            @click="handleLogout"
          >
            Logout
          </UButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :title="error"
        icon="i-ph-warning-circle"
        class="mb-8"
      />

      <HeroAdmin
        @show-toast="(msg: string, type: 'success' | 'error') => showToast(msg, type)"
      />

      <div class="border-default mb-12 border-t" />

      <div
        ref="projectListRef"
        class="flex flex-col gap-3"
      >
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card group from-elevated to-elevated/50 border-default hover:border-accented hover:from-elevated hover:to-elevated/70 flex cursor-grab items-stretch gap-0 overflow-hidden border bg-gradient-to-br backdrop-blur-sm active:cursor-grabbing"
          role="button"
          tabindex="0"
        >
          <div class="bg-elevated border-default relative w-1/3 flex-shrink-0 self-stretch overflow-hidden border-r">
            <template v-if="project.Images && project.Images.length > 0">
              <img
                :src="getImageUrl(project, project.Images[0])"
                :alt="project.Title"
                class="absolute inset-0 h-full w-full object-cover"
              >
            </template>
            <div
              v-else
              class="bg-elevated flex h-full w-full items-center justify-center"
            >
              <span class="text-dimmed text-sm">&ndash;</span>
            </div>
            <div class="bg-default/70 text-highlighted absolute top-2 left-2 px-2 py-1 text-xs font-medium tracking-wide backdrop-blur-md">
              {{ project.Images?.length || 0 }} {{ project.Images?.length === 1 ? 'image' : 'images' }}
            </div>
          </div>

          <div class="min-w-0 flex-1 p-5">
            <div class="mb-2">
              <h3 class="text-highlighted text-base font-semibold tracking-tight">
                {{ project.Title }}
              </h3>
            </div>
            <p class="text-muted mb-3 line-clamp-2 text-sm leading-relaxed">
              {{ project.Description }}
            </p>

            <div
              v-if="(project.Responsibility && project.Responsibility.length > 0) || (project.Responsibility_json && project.Responsibility_json.length > 0)"
              class="mb-4 flex flex-wrap gap-2"
            >
              <span
                v-for="(resp, idx) in (project.Responsibility_json || project.Responsibility || [])"
                :key="`${resp}-${idx}`"
                class="bg-elevated border-default text-toned border px-2.5 py-1 text-xs font-medium tracking-wider uppercase backdrop-blur-sm"
              >
                {{ resp }}
              </span>
            </div>

            <div class="flex gap-2.5">
              <UButton
                variant="outline"
                color="neutral"
                size="sm"
                class="text-xs tracking-wide uppercase"
                @click="editingProject = project"
              >
                Edit
              </UButton>
              <UButton
                color="error"
                variant="soft"
                size="sm"
                class="text-xs tracking-wide uppercase"
                @click="handleDelete(project.id)"
              >
                Delete
              </UButton>
            </div>
          </div>

          <div class="drag-handle text-muted group-hover:text-toned border-default flex cursor-grab items-center border-l px-4 transition-colors duration-200 active:cursor-grabbing">
            <UIcon
              name="i-ph-dots-six-vertical"
              class="size-6"
            />
          </div>
        </div>
      </div>

      <div
        v-if="projects.length === 0"
        class="py-20 text-center"
      >
        <p class="text-dimmed text-sm tracking-wider uppercase">
          No projects yet
        </p>
        <p class="text-dimmed mt-2 text-xs">
          Create your first project to get started
        </p>
      </div>

      <div class="mt-12">
        <UButton
          variant="outline"
          color="neutral"
          size="md"
          class="text-sm tracking-wide uppercase"
          @click="showNewProjectForm = true"
        >
          <template #leading>
            <UIcon
              name="i-ph-plus"
              class="size-4"
            />
          </template>
          New Project
        </UButton>
      </div>

      <div class="border-default my-12 border-t" />

      <div class="mb-4">
        <h2 class="text-highlighted text-lg font-medium">
          Table Version (Preview)
        </h2>
        <p class="text-muted text-xs tracking-wide uppercase">
          Testing new table layout
        </p>
      </div>

      <ProjectTable
        :projects="projects"
        @edit="editingProject = $event"
        @delete="handleDelete"
        @reorder="handleReorder"
        @open-settings="showSettings = true"
      />
    </main>

    <LazyProjectEditor
      :project="editingProject"
      :is-open="!!editingProject || showNewProjectForm"
      @save="handleSave"
      @cancel="editingProject = null; showNewProjectForm = false"
      @show-toast="(msg: string, type: 'success' | 'error') => showToast(msg, type)"
    />

    <LazySettingsSidebar
      :is-open="showSettings"
      @close="showSettings = false"
      @show-toast="(msg: string, type: 'success' | 'error') => showToast(msg, type)"
    />

    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Project"
    >
      <template #body>
        <p class="text-muted text-sm">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <UButton
          variant="outline"
          color="neutral"
          class="flex-1 text-sm tracking-wide uppercase"
          @click="isDeleteModalOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          class="flex-1 text-sm tracking-wide uppercase"
          @click="confirmDelete"
        >
          Delete
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.admin-container {
  font-family: 'EnduroWeb', sans-serif;
}

.project-card {
  position: relative;
}
</style>
