import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/index.vue'
import Main from '@/views/main.vue'
import Open from '@/views/open.vue'
import Result from '@/views/result.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Index },
  { path: '/main', component: Main },
  { path: '/open/:id', component: Open ,props: true},
  { path: '/result', component: Result }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes // `routes: routes` 的缩写
})

export default router
