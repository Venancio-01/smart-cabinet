import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import Activate from '@/pages/activate.vue'
import Record from '@/pages/record.vue'
import Check from '@/pages/check.vue'
import Alarm from '@/pages/alarm.vue'
import RecordDetail from '@/pages/record-detail.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/index' },
  { path: '/activate', component: Activate },
  {
    path: '/index',
    component: Index,
  },
  {
    path: '/record',
    component: Record,
  },
  {
    path: '/check',
    component: Check,
  },
  {
    path: '/alarm',
    component: Alarm,
  },
  {
    path: '/record-detail/:id/:fromAlarmPage',
    component: RecordDetail,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
