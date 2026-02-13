<script setup lang="ts">
import type { Homepage, PortfolioProject } from '~/plugins/pocketbase.client'
import { getImageUrl, pb } from '~/plugins/pocketbase.client'

definePageMeta({
  layout: 'admin',
})

const { showToast } = useAppToast()

const editingProject = ref<PortfolioProject | null>(null)
const showNewProjectForm = ref(false)
const showSettings = ref(false)
const showMobilePreview = ref(false)
const isReordering = ref(false)
const isEditingTitle = ref(false)
const tempTitle = ref('')
const isDeleteModalOpen = ref(false)
const projectToDelete = ref<string | null>(null)
const heroFileInput = ref<HTMLInputElement | null>(null)
const heroMobileFileInput = ref<HTMLInputElement | null>(null)

// Drag reorder state
const draggedProjectId = ref<string | null>(null)

// Fetch data with useAsyncData
const { data: homepageRaw, refresh: refreshHomepage, error: homepageError } = useAsyncData(
  'admin-homepage',
  () => pb.collection('Homepage').getFirstListItem<Homepage>('Is_Active = true', { requestKey: null }),
)

const { data: rawProjects, refresh: refreshProjects, status: projectsStatus, error: projectsError } = useAsyncData(
  'admin-projects',
  () => pb.collection('Portfolio_Projects').getFullList<PortfolioProject>({ sort: 'Order', requestKey: null }),
)

// Local mutable copy of projects for drag reorder UI
const projects = ref<PortfolioProject[]>([])
watch(rawProjects, (val) => {
  if (val)
    projects.value = [...val]
}, { immediate: true })

// Derived state from homepage data
const heroImage = computed(() =>
  homepageRaw.value?.Hero_Image ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image) : '',
)
const heroImageMobile = computed(() =>
  homepageRaw.value?.Hero_Image_Mobile ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image_Mobile) : '',
)
const homepageId = computed(() => homepageRaw.value?.id || '')

// heroTitle is editable, so keep as a separate mutable ref
const heroTitle = ref('')
watch(homepageRaw, (val) => {
  if (val)
    heroTitle.value = val.Hero_Title || ''
}, { immediate: true })

const loading = computed(() => projectsStatus.value === 'pending')
const error = computed(() => {
  const err = projectsError.value || homepageError.value
  return err ? 'Failed to load projects' : null
})

// Handle auth errors from useAsyncData
watch([projectsError, homepageError], ([pErr, hErr]) => {
  const err = pErr || hErr
  if (err) {
    const status = (err as { status?: number })?.status
      || (err as { data?: { status?: number } })?.data?.status
    if (status === 401 || status === 403) {
      pb.authStore.clear()
      navigateTo('/admin')
    }
  }
})

async function handleHeroImageUpdate(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !homepageId.value)
    return
  try {
    const formData = new FormData()
    formData.append('Hero_Image', file)
    await $fetch(`/api/homepage/${homepageId.value}`, {
      method: 'PUT',
      body: formData,
      headers: { Authorization: pb.authStore.token },
    })
    await refreshHomepage()
  }
  catch (err: unknown) {
    const typedErr = err as { data?: { message?: string }, message?: string }
    showToast(`Failed to update hero image: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
  }
}

async function handleHeroImageMobileUpdate(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !homepageId.value)
    return
  try {
    const formData = new FormData()
    formData.append('Hero_Image_Mobile', file)
    await $fetch(`/api/homepage/${homepageId.value}`, {
      method: 'PUT',
      body: formData,
      headers: { Authorization: pb.authStore.token },
    })
    await refreshHomepage()
  }
  catch (err: unknown) {
    const typedErr = err as { data?: { message?: string }, message?: string }
    showToast(`Failed to update mobile hero image: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
  }
}

function handleLogout() {
  pb.authStore.clear()
  navigateTo('/admin')
}

function handleTitleClick() {
  tempTitle.value = heroTitle.value
  isEditingTitle.value = true
}

async function handleTitleSave() {
  if (!homepageId.value || tempTitle.value.trim() === heroTitle.value) {
    isEditingTitle.value = false
    return
  }
  try {
    await $fetch(`/api/homepage/${homepageId.value}`, {
      method: 'PUT',
      body: { Hero_Title: tempTitle.value.trim() },
      headers: { Authorization: pb.authStore.token },
    })
    heroTitle.value = tempTitle.value.trim()
    isEditingTitle.value = false
  }
  catch (err: unknown) {
    const typedErr = err as { data?: { message?: string }, message?: string }
    showToast(`Failed to update hero title: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
    isEditingTitle.value = false
  }
}

function handleTitleCancel() {
  isEditingTitle.value = false
  tempTitle.value = ''
}

function handleDelete(projectId: string) {
  projectToDelete.value = projectId
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!projectToDelete.value)
    return
  try {
    await $fetch(`/api/projects/${projectToDelete.value}`, {
      method: 'DELETE',
      headers: { Authorization: pb.authStore.token },
    })
    isDeleteModalOpen.value = false
    projectToDelete.value = null
    await refreshProjects()
    showToast('Project deleted successfully', 'success')
  }
  catch (err: unknown) {
    const typedErr = err as { statusCode?: number, data?: { statusCode?: number, message?: string }, message?: string }
    const status = typedErr?.statusCode || typedErr?.data?.statusCode
    if (status === 401 || status === 403) {
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

// Drag reorder handlers
function handleDragStart(e: DragEvent, projectId: string) {
  draggedProjectId.value = projectId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function handleDragOver(e: DragEvent, targetProjectId: string) {
  e.preventDefault()
  if (!draggedProjectId.value || draggedProjectId.value === targetProjectId)
    return

  const draggedIdx = projects.value.findIndex(p => p.id === draggedProjectId.value)
  const targetIdx = projects.value.findIndex(p => p.id === targetProjectId)
  if (draggedIdx === -1 || targetIdx === -1)
    return

  const newProjects = [...projects.value]
  const [draggedItem] = newProjects.splice(draggedIdx, 1)
  newProjects.splice(targetIdx, 0, draggedItem)
  projects.value = newProjects
}

async function handleDragEnd() {
  if (!draggedProjectId.value || isReordering.value) {
    draggedProjectId.value = null
    return
  }

  isReordering.value = true
  draggedProjectId.value = null

  try {
    await $fetch('/api/projects/reorder', {
      method: 'PUT',
      body: {
        items: projects.value.map((project, index) => ({
          id: project.id,
          order: index + 1,
        })),
      },
      headers: { Authorization: pb.authStore.token },
    })
  }
  catch (err: unknown) {
    await refreshProjects()
    const typedErr = err as { data?: { message?: string }, message?: string }
    showToast(`Failed to reorder projects: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
  }
  finally {
    isReordering.value = false
  }
}
</script>

<template>
  <div
    v-if="loading"
    class="min-h-screen bg-black flex items-center justify-center"
  >
    <div class="text-xl text-white">
      Loading...
    </div>
  </div>

  <div
    v-else
    class="admin-container min-h-screen bg-black"
  >
    <!-- Header -->
    <header class="border-b border-neutral-800/70 backdrop-blur-sm bg-black/80 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
        <div>
          <h1 class="text-xl font-medium text-white tracking-tight">
            Portfolio
          </h1>
          <p class="text-xs text-neutral-500 mt-1 tracking-wide">
            {{ projects.length }} {{ projects.length === 1 ? 'project' : 'projects' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            size="sm"
            class="uppercase text-xs tracking-wide"
          >
            View Portfolio
          </UButton>
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-lucide-settings"
            aria-label="Settings"
            @click="showSettings = true"
          />
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            class="uppercase text-xs tracking-wide"
            @click="handleLogout"
          >
            Logout
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :title="error"
        icon="i-lucide-alert-circle"
        class="mb-8"
      />

      <!-- Hero Image Section -->
      <div v-if="heroImage || heroImageMobile" class="mb-12">
        <div class="flex gap-6">
          <!-- Desktop Preview -->
          <div :style="{ width: showMobilePreview ? '66.67%' : '100%', transition: 'width 0.3s ease-out', flexShrink: 0 }">
            <div
              class="preview-container relative w-full rounded-sm overflow-hidden bg-neutral-900/30 border border-neutral-800/70 group"
            >
              <img :src="heroImage" alt="Hero Desktop" class="absolute inset-0 w-full h-full object-cover">

              <!-- Hero Title Overlay -->
              <template v-if="heroTitle">
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="text-center px-6">
                    <button
                      :contenteditable="isEditingTitle"
                      class="admin-title text-white uppercase leading-none text-4xl outline-none pointer-events-auto inline-block" :class="[
                        isEditingTitle ? 'cursor-text' : 'cursor-pointer hover:opacity-80 transition-opacity',
                      ]"
                      :title="!isEditingTitle ? 'Click to edit' : undefined"
                      @click="!isEditingTitle && handleTitleClick()"
                      @keydown.enter.prevent="handleTitleSave"
                      @keydown.escape.prevent="handleTitleCancel"
                    >
                      {{ heroTitle }}
                    </button>
                  </div>
                </div>
                <div v-if="isEditingTitle" class="absolute bottom-6 right-6 flex gap-2 z-10 pointer-events-none">
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    icon="i-lucide-x"
                    class="pointer-events-auto"
                    title="Cancel"
                    @click="handleTitleCancel"
                  />
                  <UButton
                    size="sm"
                    icon="i-lucide-check"
                    class="pointer-events-auto"
                    title="Save"
                    @click="handleTitleSave"
                  />
                </div>
              </template>

              <!-- Update Button -->
              <div v-if="!isEditingTitle" class="absolute bottom-0 right-0 p-6 pointer-events-auto group/update">
                <UButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  icon="i-lucide-image"
                  class="opacity-0 group-hover/update:opacity-100 transition-all"
                  title="Update Desktop Hero"
                  @click="heroFileInput?.click()"
                />
              </div>
            </div>
          </div>

          <!-- Mobile Preview -->
          <div
            :style="{
              width: showMobilePreview ? 'calc(33.33% - 24px)' : '0%',
              opacity: showMobilePreview ? 1 : 0,
              overflow: 'hidden',
              transition: 'width 0.3s ease-out, opacity 0.3s ease-out',
              flexShrink: 0,
            }"
          >
            <div
              class="preview-container relative w-full rounded-sm overflow-hidden bg-neutral-900/30 border border-neutral-800/70 group"
            >
              <img :src="heroImageMobile" alt="Hero Mobile" class="absolute inset-0 w-full h-full object-cover">

              <div v-if="!isEditingTitle" class="absolute bottom-0 right-0 p-6 pointer-events-auto group/update">
                <UButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  icon="i-lucide-image"
                  class="opacity-0 group-hover/update:opacity-100 transition-all"
                  title="Update Mobile Hero"
                  @click="heroMobileFileInput?.click()"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Toggle mobile preview -->
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          class="mt-3 uppercase text-xs tracking-wide"
          @click="showMobilePreview = !showMobilePreview"
        >
          {{ showMobilePreview ? 'Hide mobile preview' : 'Show mobile preview' }}
        </UButton>

        <input id="heroFileInput" ref="heroFileInput" type="file" accept="image/*" class="hidden" aria-label="Update Desktop Hero Image" @change="handleHeroImageUpdate">
        <input id="heroMobileFileInput" ref="heroMobileFileInput" type="file" accept="image/*" class="hidden" aria-label="Update Mobile Hero Image" @change="handleHeroImageMobileUpdate">
      </div>

      <!-- Divider -->
      <div class="border-t border-white/10 mb-12" />

      <!-- Projects List -->
      <div class="flex flex-col gap-3">
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -->
        <div
          v-for="project in projects"
          :key="project.id"
          draggable="true"
          class="project-card group bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 rounded-sm border border-neutral-800/70 hover:border-neutral-700 hover:from-neutral-900/70 hover:to-neutral-900/50 cursor-grab active:cursor-grabbing flex items-stretch gap-0 overflow-hidden backdrop-blur-sm"
          role="button"
          tabindex="0"
          @dragstart="handleDragStart($event, project.id)"
          @dragover="handleDragOver($event, project.id)"
          @dragend="handleDragEnd"
        >
          <!-- Thumbnail -->
          <div class="relative w-1/3 bg-neutral-900/80 overflow-hidden flex-shrink-0 border-r border-neutral-800/70 self-stretch">
            <template v-if="project.Images && project.Images.length > 0">
              <img :src="getImageUrl(project, project.Images[0])" :alt="project.Title" class="w-full h-full object-cover absolute inset-0">
            </template>
            <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900/50">
              <span class="text-neutral-600 text-sm">&ndash;</span>
            </div>
            <div class="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-sm text-xs font-medium tracking-wide">
              {{ project.Images?.length || 0 }} {{ project.Images?.length === 1 ? 'image' : 'images' }}
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 p-5">
            <div class="mb-2">
              <h3 class="font-semibold text-base text-white tracking-tight">
                {{ project.Title }}
              </h3>
            </div>
            <p class="text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-3">
              {{ project.Description }}
            </p>

            <!-- Responsibilities -->
            <div
              v-if="(project.Responsibility && project.Responsibility.length > 0) || (project.Responsibility_json && project.Responsibility_json.length > 0)"
              class="flex flex-wrap gap-2 mb-4"
            >
              <span
                v-for="(resp, idx) in (project.Responsibility_json || project.Responsibility || [])"
                :key="`${resp}-${idx}`"
                class="px-2.5 py-1 bg-neutral-800/70 border border-neutral-700/60 text-neutral-300 rounded-sm text-xs uppercase tracking-wider font-medium backdrop-blur-sm"
              >
                {{ resp }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex gap-2.5">
              <UButton
                variant="outline"
                color="neutral"
                size="sm"
                class="uppercase text-xs tracking-wide"
                @click="editingProject = project"
              >
                Edit
              </UButton>
              <UButton
                color="error"
                variant="soft"
                size="sm"
                class="uppercase text-xs tracking-wide"
                @click="handleDelete(project.id)"
              >
                Delete
              </UButton>
            </div>
          </div>

          <!-- Drag Handle -->
          <div class="flex items-center px-4 text-neutral-700 group-hover:text-neutral-500 transition-colors duration-200 border-l border-neutral-800/70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" />
              <circle cx="15" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="15" cy="18" r="1.5" />
            </svg>
          </div>
        </div>
      </div>

      <div v-if="projects.length === 0" class="text-center py-20">
        <p class="text-neutral-600 text-sm uppercase tracking-wider">
          No projects yet
        </p>
        <p class="text-neutral-700 text-xs mt-2">
          Create your first project to get started
        </p>
      </div>

      <!-- Create New Project Button -->
      <div class="mt-12">
        <UButton
          size="md"
          class="uppercase text-sm tracking-wide"
          @click="showNewProjectForm = true"
        >
          <template #leading>
            <UIcon name="i-lucide-plus" class="size-4" />
          </template>
          New Project
        </UButton>
      </div>
    </main>

    <!-- Project Editor Overlay -->
    <LazyProjectEditor
      v-if="editingProject || showNewProjectForm"
      :project="editingProject"
      @save="handleSave"
      @cancel="editingProject = null; showNewProjectForm = false"
      @show-toast="(msg: string, type: 'success' | 'error') => showToast(msg, type)"
    />

    <!-- Settings Sidebar -->
    <LazySettingsSidebar
      :is-open="showSettings"
      @close="showSettings = false"
      @show-toast="(msg: string, type: 'success' | 'error') => showToast(msg, type)"
    />

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen" title="Delete Project">
      <template #body>
        <p class="text-sm text-neutral-400">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <UButton
          variant="outline"
          color="neutral"
          class="flex-1 uppercase text-sm tracking-wide"
          @click="isDeleteModalOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          class="flex-1 uppercase text-sm tracking-wide"
          @click="confirmDelete"
        >
          Delete
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
/* Admin typography */
.admin-container {
  font-family: 'EnduroWeb, sans-serif';
}

.admin-title {
  font-family: 'EnduroWeb', sans-serif;
  letter-spacing: 0.03em;
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: center;
  display: inline-block;
}

/* Preview containers */
.preview-container {
  height: 680px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
}

/* Project cards */
.project-card {
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
}
</style>
