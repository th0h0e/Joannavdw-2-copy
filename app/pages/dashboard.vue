<script setup lang="ts">
import type { HomepageResponse, PortfolioProjectsResponse } from '~/shared/types/pocketbase-types'
import { useSortable } from '@vueuse/integrations/useSortable'
import { getImageUrl, pb } from '~/utils/pocketbase'

definePageMeta({
  layout: 'admin',
})

const { showToast } = useAppToast()

const editingProject = ref<PortfolioProjectsResponse<string[]> | null>(null)
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

const projectListRef = useTemplateRef('projectListRef')

const { data: homepageRaw, refresh: refreshHomepage, error: homepageError } = useAsyncData(
  'admin-homepage',
  () => pb.collection('Homepage').getFirstListItem<HomepageResponse>('Is_Active = true', { requestKey: null }),
)

const { data: rawProjects, refresh: refreshProjects, status: projectsStatus, error: projectsError } = useAsyncData(
  'admin-projects',
  () => pb.collection('Portfolio_Projects').getFullList<PortfolioProjectsResponse<string[]>>({ sort: 'Order', requestKey: null }),
)

const projects = ref<PortfolioProjectsResponse<string[]>[]>([])
watch(rawProjects, (val) => {
  if (val)
    projects.value = [...val]
}, { immediate: true })

useSortable(projectListRef, projects, {
  animation: 150,
  handle: '.project-card',
  onEnd: async () => {
    if (isReordering.value)
      return

    isReordering.value = true
    try {
      for (const [index, project] of projects.value.entries()) {
        await pb.collection('Portfolio_Projects').update(project.id, { Order: index + 1 })
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

const heroImage = computed(() =>
  homepageRaw.value?.Hero_Image ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image) : '',
)
const heroImageMobile = computed(() =>
  homepageRaw.value?.Hero_Image_Mobile ? getImageUrl(homepageRaw.value, homepageRaw.value.Hero_Image_Mobile) : '',
)
const homepageId = computed(() => homepageRaw.value?.id || '')

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
    await pb.collection('Homepage').update(homepageId.value, formData)
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
    await pb.collection('Homepage').update(homepageId.value, formData)
    await refreshHomepage()
  }
  catch (err: unknown) {
    const typedErr = err as { data?: { message?: string }, message?: string }
    showToast(`Failed to update mobile hero image: ${typedErr?.data?.message || typedErr?.message || 'Unknown error'}`, 'error')
  }
}

function handleLogout() {
  pb.authStore.clear()
  navigateTo('/')
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
    await pb.collection('Homepage').update(homepageId.value, { Hero_Title: tempTitle.value.trim() })
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
    await pb.collection('Portfolio_Projects').delete(projectToDelete.value)
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

async function handlePublishChanges() {
  try {
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
    class="min-h-screen bg-default flex items-center justify-center"
  >
    <div class="text-xl text-highlighted">
      Loading...
    </div>
  </div>

  <div
    v-else
    class="admin-container min-h-screen bg-default"
  >
    <header class="border-b border-default backdrop-blur-sm bg-default/80 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
        <div>
          <h1 class="text-xl font-medium text-highlighted tracking-tight">
            Portfolio
          </h1>
          <p class="text-xs text-muted mt-1 tracking-wide">
            {{ projects.length }} {{ projects.length === 1 ? 'project' : 'projects' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <UColorModeButton />
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-ph-cloud-arrow-up"
            class="uppercase text-xs tracking-wide"
            @click="handlePublishChanges"
          >
            Publish Changes
          </UButton>
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
            icon="i-ph-gear"
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

    <main class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :title="error"
        icon="i-ph-warning-circle"
        class="mb-8"
      />

      <div v-if="heroImage || heroImageMobile" class="mb-12">
        <div class="flex gap-6">
          <div :style="{ width: showMobilePreview ? '66.67%' : '100%', transition: 'width 0.3s ease-out', flexShrink: 0 }">
            <div
              class="preview-container relative w-full overflow-hidden bg-elevated border border-default group"
            >
              <img :src="heroImage" alt="Hero Desktop" class="absolute inset-0 w-full h-full object-cover">

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
                    icon="i-ph-x"
                    class="pointer-events-auto"
                    title="Cancel"
                    @click="handleTitleCancel"
                  />
                  <UButton
                    size="sm"
                    icon="i-ph-check"
                    class="pointer-events-auto"
                    title="Save"
                    @click="handleTitleSave"
                  />
                </div>
              </template>

              <div v-if="!isEditingTitle" class="absolute bottom-0 right-0 p-6 pointer-events-auto group/update">
                <UButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  icon="i-ph-image"
                  class="opacity-0 group-hover/update:opacity-100 transition-all"
                  title="Update Desktop Hero"
                  @click="heroFileInput?.click()"
                />
              </div>
            </div>
          </div>

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
              class="preview-container relative w-full overflow-hidden bg-elevated border border-default group"
            >
              <img :src="heroImageMobile" alt="Hero Mobile" class="absolute inset-0 w-full h-full object-cover">

              <div v-if="!isEditingTitle" class="absolute bottom-0 right-0 p-6 pointer-events-auto group/update">
                <UButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  icon="i-ph-image"
                  class="opacity-0 group-hover/update:opacity-100 transition-all"
                  title="Update Mobile Hero"
                  @click="heroMobileFileInput?.click()"
                />
              </div>
            </div>
          </div>
        </div>

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

      <div class="border-t border-default mb-12" />

      <div ref="projectListRef" class="flex flex-col gap-3">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card group bg-gradient-to-br from-elevated to-elevated/50 border border-default hover:border-accented hover:from-elevated hover:to-elevated/70 cursor-grab active:cursor-grabbing flex items-stretch gap-0 overflow-hidden backdrop-blur-sm"
          role="button"
          tabindex="0"
        >
          <div class="relative w-1/3 bg-elevated overflow-hidden flex-shrink-0 border-r border-default self-stretch">
            <template v-if="project.Images && project.Images.length > 0">
              <img :src="getImageUrl(project, project.Images[0])" :alt="project.Title" class="w-full h-full object-cover absolute inset-0">
            </template>
            <div v-else class="w-full h-full flex items-center justify-center bg-elevated">
              <span class="text-dimmed text-sm">&ndash;</span>
            </div>
            <div class="absolute top-2 left-2 bg-default/70 backdrop-blur-md text-highlighted px-2 py-1 text-xs font-medium tracking-wide">
              {{ project.Images?.length || 0 }} {{ project.Images?.length === 1 ? 'image' : 'images' }}
            </div>
          </div>

          <div class="flex-1 min-w-0 p-5">
            <div class="mb-2">
              <h3 class="font-semibold text-base text-highlighted tracking-tight">
                {{ project.Title }}
              </h3>
            </div>
            <p class="text-sm text-muted line-clamp-2 leading-relaxed mb-3">
              {{ project.Description }}
            </p>

            <div
              v-if="(project.Responsibility && project.Responsibility.length > 0) || (project.Responsibility_json && project.Responsibility_json.length > 0)"
              class="flex flex-wrap gap-2 mb-4"
            >
              <span
                v-for="(resp, idx) in (project.Responsibility_json || project.Responsibility || [])"
                :key="`${resp}-${idx}`"
                class="px-2.5 py-1 bg-elevated border border-default text-toned text-xs uppercase tracking-wider font-medium backdrop-blur-sm"
              >
                {{ resp }}
              </span>
            </div>

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

          <div class="flex items-center px-4 text-muted group-hover:text-toned transition-colors duration-200 border-l border-default">
            <UIcon name="i-ph-dots-six-vertical" class="size-6" />
          </div>
        </div>
      </div>

      <div v-if="projects.length === 0" class="text-center py-20">
        <p class="text-dimmed text-sm uppercase tracking-wider">
          No projects yet
        </p>
        <p class="text-dimmed text-xs mt-2">
          Create your first project to get started
        </p>
      </div>

      <div class="mt-12">
        <UButton
          size="md"
          class="uppercase text-sm tracking-wide"
          @click="showNewProjectForm = true"
        >
          <template #leading>
            <UIcon name="i-ph-plus" class="size-4" />
          </template>
          New Project
        </UButton>
      </div>
    </main>

    <LazyProjectEditor
      v-if="editingProject || showNewProjectForm"
      :project="editingProject"
      @save="handleSave"
      @cancel="editingProject = null; showNewProjectForm = false"
      @show-toast="(msg: string, type: 'success' | 'error') => showToast(msg, type)"
    />

    <LazySettingsSidebar
      :is-open="showSettings"
      @close="showSettings = false"
      @show-toast="(msg: string, type: 'success' | 'error') => showToast(msg, type)"
    />

    <UModal v-model:open="isDeleteModalOpen" title="Delete Project">
      <template #body>
        <p class="text-sm text-muted">
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
.admin-container {
  font-family: 'EnduroWeb', sans-serif;
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

.preview-container {
  height: 680px;
}

.project-card {
  position: relative;
}
</style>
