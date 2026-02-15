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
    <div class="bg-default flex min-h-screen flex-col">
      <header class="border-default bg-default/80 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <NuxtLink
            to="/"
            class="text-highlighted text-xl font-medium tracking-tight"
          >
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

      <main class="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p class="text-primary text-base font-semibold">
          {{ error.statusCode }}
        </p>
        <h1 class="text-highlighted mt-2 text-4xl font-bold text-balance sm:text-5xl">
          {{ isAuthError ? 'Authentication Required' : isNotFoundError ? 'Page Not Found' : 'Something went wrong' }}
        </h1>
        <p class="text-muted mt-4 max-w-md text-lg text-balance">
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

      <footer class="border-default border-t py-6">
        <div class="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p class="text-muted text-xs tracking-wide uppercase">
            &copy; {{ new Date().getFullYear() }} Joanna van der Werf
          </p>
        </div>
      </footer>
    </div>
  </UApp>
</template>
