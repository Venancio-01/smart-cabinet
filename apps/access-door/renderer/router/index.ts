import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import Activate from '@/pages/activate.vue'
import RfidRecord from '@/pages/rfid-record.vue'
import WarningRecord from '@/pages/warning-record.vue'
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
    path: '/rfid-record',
    component: RfidRecord,
  },
  {
    path: '/warning-record',
    component: WarningRecord,
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
    path: '/record-detail',
    component: RecordDetail,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
