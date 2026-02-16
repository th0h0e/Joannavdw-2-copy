import { pb } from '#layers/2.admin/app/utils/pocketbase'

export default defineNuxtPlugin(() => {
  const route = useRoute()

  pb.authStore.onChange((token, record) => {
    console.warn('[Auth Plugin] Auth state changed:', {
      hasToken: !!token,
      hasRecord: !!record,
      isValid: pb.authStore.isValid,
      currentRoute: route.path,
    })

    if (!pb.authStore.isValid && route.path.startsWith('/dashboard')) {
      console.warn('[Auth Plugin] Token expired on protected route, redirecting to /admin')
      navigateTo('/admin')
    }
  })
})
