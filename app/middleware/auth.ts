import { pb } from '~/plugins/pocketbase.client'

export default defineNuxtRouteMiddleware(() => {
  if (!pb.authStore.isValid) {
    return navigateTo('/admin')
  }
})
