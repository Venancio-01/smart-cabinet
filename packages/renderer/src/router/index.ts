import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/index.vue'
import Main from '@/views/main.vue'
import Login from '@/views/login.vue'
import Open from '@/views/open.vue'
import Result from '@/views/result.vue'
import Carrier from '@/views/carrier.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    component: Index
  },
  {
    path: '/login',
    component: Login
  },
  { path: '/main', component: Main },
  { path: '/open/:id', component: Open, props: true },
  { path: '/result', component: Result },
  { path: '/carrier/:state', component: Carrier, props: true }
]

const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes //
})

export default router
