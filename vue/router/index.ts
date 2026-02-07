import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/admin',
      component: () => import('../pages/admin/AdminLogin.vue'),
    },
    {
      path: '/admin/dashboard',
      component: () => import('../pages/admin/AdminDashboard.vue'),
    },
  ],
})

export { router }
