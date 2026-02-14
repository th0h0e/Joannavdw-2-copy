<script setup lang="ts">
import loginBackground from '~/assets/admin-login-bg.jpg'
import { pb } from '~/utils/pocketbase'

// Form state
const formState = reactive({
  email: '',
  password: '',
})

const error = ref('')
const loading = ref(false)

onMounted(() => {
  if (pb.authStore.isValid) {
    navigateTo('/dashboard')
  }
})

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await pb.collection('users').authWithPassword(formState.email, formState.password)
    await navigateTo('/dashboard')
  }
  catch (err: unknown) {
    console.error('Login error:', err)
    const typedErr = err as { response?: { message?: string }, message?: string }
    error.value = typedErr?.response?.message || typedErr?.message || 'Failed to login. Please check your credentials.'
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-neutral-900 flex items-center justify-center px-6 relative overflow-hidden font-sans"
  >
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{
        backgroundImage: `url(${loginBackground})`,
        filter: 'blur(8px)',
        transform: 'scale(1.1)',
      }"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/70" />

    <!-- Login Form -->
    <div class="max-w-md w-full bg-black/80 rounded-sm border border-neutral-800/60 p-10 backdrop-blur-xl relative z-10">
      <div class="text-center mb-8">
        <h1 class="text-xl font-medium text-white tracking-tight">
          Admin Login
        </h1>
        <p class="text-xs text-neutral-400 mt-2 tracking-wide uppercase">
          Access Dashboard
        </p>
      </div>

      <UForm :state="formState" class="space-y-6" @submit="handleLogin">
        <UFormField label="Email" required>
          <UInput
            v-model="formState.email"
            type="email"
            placeholder="admin@example.com"
            color="neutral"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" required>
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="••••••••"
            color="neutral"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <div v-if="error" class="bg-error-950/20 border border-error-800/30 text-error-200 px-4 py-3 rounded-sm text-sm">
          {{ error }}
        </div>

        <UButton
          type="submit"
          :loading="loading"
          class="w-full"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </UButton>
      </UForm>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wide">
          &larr; Back to Portfolio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
