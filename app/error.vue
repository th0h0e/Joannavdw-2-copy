<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isAuthError = computed(() =>
  props.error.statusCode === 401 || props.error.statusCode === 403)

const isNotFoundError = computed(() =>
  props.error.statusCode === 404)

function handleError() {
  if (isAuthError.value) {
    clearError({ redirect: '/admin' })
  }
  else {
    clearError({ redirect: '/' })
  }
}

function getErrorMessage(): string {
  if (isAuthError.value) {
    return 'Your session has expired. Please log in again.'
  }
  if (isNotFoundError.value) {
    return 'The page you are looking for does not exist.'
  }
  if (props.error.message?.includes('Failed to fetch') || props.error.message?.includes('NetworkError')) {
    return 'Unable to connect to the server. Please check your connection.'
  }
  return props.error.message || 'An unexpected error occurred.'
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-default flex flex-col">
      <header class="border-b border-default backdrop-blur-sm bg-default/80 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <NuxtLink to="/" class="text-xl font-medium text-highlighted tracking-tight">
            Joanna van der Werf
          </NuxtLink>
          <div class="flex items-center gap-3">
            <UColorModeButton />
            <UButton
              to="/"
              variant="ghost"
              color="neutral"
              size="sm"
            >
              Portfolio
            </UButton>
            <UButton
              to="/admin"
              variant="outline"
              color="neutral"
              size="sm"
            >
              Admin
            </UButton>
          </div>
        </div>
      </header>

      <main class="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p class="text-base font-semibold text-primary">
          {{ error.statusCode }}
        </p>
        <h1 class="mt-2 text-4xl sm:text-5xl font-bold text-highlighted text-balance">
          {{ isAuthError ? 'Authentication Required' : isNotFoundError ? 'Page Not Found' : 'Something went wrong' }}
        </h1>
        <p class="mt-4 text-lg text-muted text-balance max-w-md">
          {{ getErrorMessage() }}
        </p>

        <div class="mt-8 flex items-center justify-center gap-4">
          <UButton
            variant="outline"
            color="neutral"
            size="lg"
            @click="handleError"
          >
            {{ isAuthError ? 'Go to Login' : 'Back to Home' }}
          </UButton>
          <UButton
            v-if="!isAuthError"
            to="/admin"
            variant="solid"
            color="primary"
            size="lg"
          >
            Go to Admin
          </UButton>
        </div>
      </main>

      <footer class="border-t border-default py-6">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p class="text-xs text-muted uppercase tracking-wide">
            &copy; {{ new Date().getFullYear() }} Joanna van der Werf
          </p>
        </div>
      </footer>
    </div>
  </UApp>
</template>
