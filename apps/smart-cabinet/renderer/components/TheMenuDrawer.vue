<script lang="ts" setup>
import { VIcon } from '@smart-cabinet/components'
import { useStore } from '@/store'
import useLogin from '@/hooks/useLogin'
import useVerify from '@/hooks/useVerify'
import useCheck from '@/hooks/useCheck'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})
const emits = defineEmits(['update:visible', 'change'])
const store = useStore()
const { user, departmentList, roleList, userRoleList } = storeToRefs(store)
const { handleLogout } = useLogin()
const { verifyIsExpired, openVerifyIdentityDialog, saveCallback } = useVerify()
const { handleManualCheck } = useCheck()

const show = computed({
  get: () => props.visible,
  set: (val) => {
    emits('update:visible', val)
  },
})

watch(show, (val) => {
  emits('change', val)
})

const setPasswordVisible = ref(false)
function handleSetPassword() {
  const isExpired = verifyIsExpired()
  const cb = () => {
    setPasswordVisible.value = true
  }

  if (isExpired) {
    openVerifyIdentityDialog()
    saveCallback(cb)
  }
  else {
    cb()
  }
}

const setFingerVisible = ref(false)
const fingerOrder = ref<1 | 2>(1)
function handleSetFinger(order: 1 | 2) {
  const isExpired = verifyIsExpired()
  const cb = () => {
    fingerOrder.value = order
    setFingerVisible.value = true
  }

  if (isExpired) {
    openVerifyIdentityDialog()
    saveCallback(cb)
  }
  else {
    cb()
  }
}

const setCardVisible = ref(false)
function handleSetCard() {
  const isExpired = verifyIsExpired()
  const cb = () => {
    setCardVisible.value = true
  }

  if (isExpired) {
    openVerifyIdentityDialog()
    saveCallback(cb)
  }
  else {
    cb()
  }
}

const departmentName = computed(() => {
  return departmentList.value.find(department => user.value.deptId === department.deptId)?.deptName
})
const roleName = computed(() => {
  const roleId = userRoleList.value.find(userRole => user.value.userId === userRole.userId)?.roleId
  if (!roleId) return ''

  return roleList.value.find(role => role.roleId === roleId)?.roleName
})
</script>

<template>
  <a-drawer v-model:visible="show" placement="right" :closable="false" class="menu-drawer" width="240px" :z-index="999">
    <!-- 设置密码 -->
    <SetPasswordDialog v-model:visible="setPasswordVisible" />
    <!-- 设置指纹 -->
    <SetFingerDialog v-model:visible="setFingerVisible" :order="fingerOrder" />
    <!-- 设置卡号 -->
    <SetCardDialog v-model:visible="setCardVisible" />

    <div class="">
      <div class="mt-[40px] mb-[4px] flex justify-center">
        <VIcon icon="user" class="text-[60px] text-light" />
      </div>
      <div class="flex justify-center items-center flex-col text-light">
        <div class="mb-[4px]">
          {{ user?.userName }}
        </div>
        <div class="mb-[4px]">
          {{ user?.department?.deptName }}
        </div>
        <div class="mb-[4px]">
          {{ user?.userRole?.[0]?.role?.roleName }}
        </div>
      </div>
    </div>

    <div class="menu text-light" @click="emits('update:visible', false)">
      <div class="item" @click="handleSetPassword">
        设置密码
      </div>
      <div class="item" @click="handleSetFinger(1)">
        设置指纹一
      </div>
      <div class="item" @click="handleSetFinger(2)">
        设置指纹二
      </div>
      <div class="item" @click="handleSetCard">
        设置卡号
      </div>
      <div class="item" @click="handleManualCheck">
        手动盘点
      </div>
      <div class="item" @click="handleLogout">
        退出登录
      </div>
    </div>
  </a-drawer>
</template>

<style>
.menu-drawer .ant-drawer-content {
  @apply bg-gray-8 bg-opacity-30;
  backdrop-filter: blur(8px);
}

.menu-drawer .ant-drawer-body {
  padding: 0;
}

.menu {
  @apply mt-4;
}

.menu .item {
  @apply flex pl-8 items-center h-[60px] select-none;
}
</style>
