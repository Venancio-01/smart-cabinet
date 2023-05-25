import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/index.vue'
import Login from '@/views/login.vue'
import Main from '@/views/main.vue'
import CabinetDoor from '@/views/cabinet-door.vue'
import ViewCarrier from '@/views/view-carrier.vue'

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
  {
    path: '/main', 
    component: Main,
    redirect: '/main/cabinet-door',
    children: [
      {
        path: 'cabinet-door',
        name: 'cabinetDoor',
        component: CabinetDoor,
      },
      {
        path: 'carrier/:state',
        component: () => import('@/views/carrier.vue'),
        props: true,
        name: 'carrier'
      },
      {
        path: 'user',
        component: () => import('@/views/user.vue'),
        name: 'user'
      },
      {
        path: 'department',
        component: () => import('@/views/department.vue'),
        name: 'department'
      },
      {
        path: 'permission',
        component: () => import('@/views/permission.vue'),
        name: 'permission'
      }
    ]
  },
  {
    path: '/view-carrier/:state',
    component: ViewCarrier,
    props: true,
  },
  { path: '/open/:id', component: () => import('@/views/open.vue'), props: true },
  { path: '/result', component: () => import('@/views/result.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
