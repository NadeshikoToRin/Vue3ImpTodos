import { createRouter, createWebHistory } from 'vue-router'
import ToDos from '@/components/ToDos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todos',
      component: ToDos
    }
  ]
})

export default router
