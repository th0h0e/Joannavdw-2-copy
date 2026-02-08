<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import loginBackground from '@/assets/admin-login-bg.jpg'
import pb from '@/config/pocketbase'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

onMounted(() => {
  if (pb.authStore.isValid) {
    router.push('/admin/dashboard')
  }
})

const handleLogin = async (e: Event) => {
  e.preventDefault()
  error.value = ''
  loading.value = true

  try {
    await pb.collection('users').authWithPassword(email.value, password.value)
    router.push('/admin/dashboard')
  } catch (err: unknown) {
    console.error('Login error:', err)
    const typedErr = err as { response?: { message?: string }, message?: string }
    error.value = typedErr?.response?.message || typedErr?.message || 'Failed to login. Please check your credentials.'
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-neutral-900 flex items-center justify-center px-6 relative overflow-hidden"
    :style="{ fontFamily: 'EnduroWeb, sans-serif' }"
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
        <h1 class="text-xl font-medium text-white tracking-tight">Admin Login</h1>
        <p class="text-xs text-neutral-400 mt-2 tracking-wide uppercase">Access Dashboard</p>
      </div>

      <form class="space-y-6" @submit="handleLogin">
        <div>
          <label for="email" class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 placeholder-neutral-500 text-sm transition-all"
            placeholder="admin@example.com"
          >
        </div>

        <div>
          <label for="password" class="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/60 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 placeholder-neutral-500 text-sm transition-all"
            placeholder="••••••••"
          >
        </div>

        <div v-if="error" class="bg-red-950/20 border border-red-800/30 text-red-200 px-4 py-3 rounded-sm text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full px-6 py-2.5 bg-black/30 border border-neutral-700/60 text-neutral-200 rounded-sm hover:bg-black/50 hover:text-white hover:border-neutral-600/60 disabled:bg-neutral-600 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-wide"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="/" class="text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wide">
          &larr; Back to Portfolio
        </a>
      </div>
    </div>
  </div>
</template>
