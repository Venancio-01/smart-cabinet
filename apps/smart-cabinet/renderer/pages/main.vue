<script lang="ts" setup>
import type { Key } from 'ant-design-vue/lib/_util/type'
import { VIcon } from '@smart-cabinet/components'
import useTime from '@/hooks/useTime'
import usePermission from '@/hooks/usePermission'
import { useStore } from '@/store'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { isLoggedIn } = storeToRefs(store)
const { resetOperationTimeoutCountdown, operationTimeout } = useTime()
const { hasPermission } = usePermission()
const activeKey = ref('1')
const visible = ref(false)

const pathMap: {
  [k in Key]: {
    path: string
    name: string
  }
} = {
  1: {
    path: '/main/cabinet-door',
    name: 'cabinetDoor',
  },
  2: {
    path: '/main/carrier/null',
    name: 'carrier',
  },
  3: {
    path: '/main/user',
    name: 'user',
  },
  4: {
    path: '/main/department',
    name: 'department',
  },
  5: {
    path: '/main/permission',
    name: 'permission',
  },
}

function handleTabChange(key: Key) {
  router.push(pathMap[key].path)
}

watch(route, () => {
  const key = Object.keys(pathMap).find(key => route.name === pathMap[key].name)
  if (key) activeKey.value = key
})

function handleUserAction() {
  resetOperationTimeoutCountdown()
}

onMounted(() => {
  window.addEventListener('click', handleUserAction)
})

onUnmounted(() => {
  window.removeEventListener('click', handleUserAction)
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <TheMenuDrawer v-model:visible="visible" />

    <!-- 头部 -->
    <div v-if="isLoggedIn" class="flex items-center justify-between mb-4">
      <a-tabs class="flex-1" :active-key="activeKey" @change="handleTabChange">
        <a-tab-pane v-if="hasPermission('borrow_return')" key="1" tab="柜门信息" />
        <a-tab-pane v-if="hasPermission('view_carrier')" key="2" tab="载体管理" />
        <a-tab-pane v-if="hasPermission('view_user')" key="3" tab="用户管理" />
        <a-tab-pane v-if="hasPermission('view_dept')" key="4" tab="机构管理" />
      </a-tabs>

      <div class="relative flex justify-end items-center min-w-[200px]">
        <div class="absolute top-1/2 -translate-y-1/2 left-0 w-[160px] h-[30px] leading-[30px] text-light flex items-center mr-12">
          <span class="mr-2 font-['Barlow'] -mt-[2px]">{{ operationTimeout }}</span>
          <span>秒后自动退出</span>
        </div>

        <VIcon v-show="!visible" icon="menu" class="icon-button" @click="visible = true" />
      </div>
    </div>

    <div v-else class="h-[50px]">
      <BackButton />
    </div>

    <div class="flex flex-1">
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  @apply text-light;
}
:deep(.ant-tabs) {
  @apply text-light;
}
:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin-left: 48px;
}
:deep(.ant-tabs-top > .ant-tabs-nav:before) {
  border-bottom: 1px solid transparent;
}
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin: 0;
}
:deep(.ant-tabs-tab:hover) {
  @apply text-light;
}

:deep(.ant-tabs-ink-bar) {
  @apply bg-light;
}
:deep(.ant-tabs-tab-btn:active) {
  @apply text-light;
}
</style>
