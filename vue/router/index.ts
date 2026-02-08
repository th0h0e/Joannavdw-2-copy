import { createRouter, createWebHistory } from 'vue-router'
import pb from '@/plugins/pocketbase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: async () => import('../pages/Home.vue'),
    },
    {
      path: '/admin',
      component: async () => import('../pages/admin/AdminLogin.vue'),
    },
    {
      path: '/admin/dashboard',
      component: async () => import('../pages/admin/AdminDashboard.vue'),
      beforeEnter: () => {
        if (!pb.authStore.isValid)
          return '/admin'
      },
    },
  ],
})

export { router }
