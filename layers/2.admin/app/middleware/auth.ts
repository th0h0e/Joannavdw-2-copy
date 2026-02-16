import { pb } from '#layers/2.admin/app/utils/pocketbase'

export default defineNuxtRouteMiddleware(() => {
  console.warn('[Auth Middleware] Checking auth state:', {
    isValid: pb.authStore.isValid,
    hasToken: !!pb.authStore.token,
  })

  if (!pb.authStore.isValid) {
    console.warn('[Auth Middleware] Not authenticated, redirecting to /admin')
    return navigateTo('/admin')
  }

  console.warn('[Auth Middleware] Authenticated, proceeding to dashboard')
})
