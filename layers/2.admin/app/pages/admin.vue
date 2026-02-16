<script setup lang="ts">
import { pb } from '#layers/2.admin/app/utils/pocketbase'
import loginBackground from '~/assets/admin-login-bg.jpg'

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
    await pb.collection('users')
      .authWithPassword(formState.email, formState.password)
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
    class="bg-default relative flex min-h-screen items-center justify-center overflow-hidden px-6 font-sans"
  >
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{
        backgroundImage: `url(${loginBackground})`,
        filter: 'blur(8px)',
        transform: 'scale(1.1)',
      }"
    />

    <div class="bg-default/70 absolute inset-0" />

    <div class="bg-elevated border-default relative z-10 w-full max-w-md border p-10 backdrop-blur-xl">
      <div class="mb-8 text-center">
        <h1 class="text-highlighted text-xl font-medium tracking-tight">
          Admin Login
        </h1>
        <p class="text-muted mt-2 text-xs tracking-wide uppercase">
          Access Dashboard
        </p>
      </div>

      <UForm
        :state="formState"
        class="space-y-6"
        @submit="handleLogin"
      >
        <UFormField
          label="Email"
          required
        >
          <UInput
            v-model="formState.email"
            type="email"
            placeholder="admin@example.com"
            color="neutral"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          required
        >
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="••••••••"
            color="neutral"
            variant="subtle"
            class="w-full"
          />
        </UFormField>

        <div
          v-if="error"
          class="bg-error-950/20 border-error-800/30 text-error-200 border px-4 py-3 text-sm"
        >
          {{ error }}
        </div>

        <UButton
          type="submit"
          variant="outline"
          color="neutral"
          :loading="loading"
          class="w-full"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </UButton>
      </UForm>

      <div class="mt-6 text-center">
        <NuxtLink
          to="/"
          class="text-muted hover:text-highlighted text-xs tracking-wide uppercase transition-colors"
        >
          &larr; Back to Portfolio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
