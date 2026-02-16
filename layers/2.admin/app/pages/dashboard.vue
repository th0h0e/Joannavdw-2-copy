<script setup lang="ts">
import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'
import { pb } from '#layers/2.admin/app/utils/pocketbase'

definePageMeta({
  layout: 'admin',
  pageTransition: {
    name: 'swipe',
    mode: 'out-in',
  },
})

const { showToast } = useAppToast()

const editingProject = ref<PortfolioProjectsResponse<string[]> | null>(null)
const showNewProjectForm = ref(false)
const showSettings = ref(false)
const isDeleteModalOpen = ref(false)
const projectToDelete = ref<string | null>(null)

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

async function handleReorder(reorderedProjects: PortfolioProjectsResponse<string[]>[]) {
  projects.value = reorderedProjects
  try {
    for (const [index, project] of reorderedProjects.entries()) {
      await pb.collection('Portfolio_Projects')
        .update(project.id, { Order: index + 1 })
    }
    await refreshProjects()
    showToast('Order updated', 'success')
  }
  catch (err: unknown) {
    const typedErr = err as { status?: number, data?: { message?: string }, message?: string }
    if (typedErr?.status === 401 || typedErr?.status === 403) {
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    showToast(`Failed to update order: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
    await refreshProjects()
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
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8 lg:py-6">
        <div>
          <h1 class="text-highlighted text-lg font-medium tracking-tight lg:text-xl">
            Portfolio
          </h1>
          <p class="text-muted mt-1 text-xs tracking-wide">
            {{ projects.length }} {{ projects.length === 1 ? 'project' : 'projects' }}
          </p>
        </div>
        <div class="flex items-center gap-2 lg:gap-3">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-ph-plus"
            class="lg:gap-2"
            @click="showNewProjectForm = true"
          >
            <span class="hidden lg:inline text-xs tracking-wide uppercase">New Project</span>
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

    <main class="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
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
</style>
