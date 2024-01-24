import { createRouter, createWebHashHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHashHistory(),
  extendRoutes(routes) {
    return routes
  },
})

export default router
