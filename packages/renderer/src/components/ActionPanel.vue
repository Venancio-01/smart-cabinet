<template>
  <div class="flex h-full w-[200px] flex-col items-center border-l-[2px] border-white">
    <!-- 设置密码 -->
    <SetPasswordDialog v-model:visible="setPasswordVisible"></SetPasswordDialog>
    <!-- 设置指纹 -->
    <SetFingerDialog v-model:visible="setFingerVisible" :order="fingerOrder"></SetFingerDialog>
    <!-- 设置卡号 -->
    <SetCardDialog v-model:visible="setCardVisible"></SetCardDialog>
    <!-- 查看文件 -->
    <ViewDocumentDialog v-model:visible="viewDocumentVisible"></ViewDocumentDialog>

    <div class="flex h-[50px] w-full select-none items-center justify-center border-b-[2px] border-white text-lg text-white">
      基本信息
    </div>
    <div class="user-info mt-[16px]">
      <div class="user-info-item">
        <span class="label">用户名称：</span>
        <span class="content">{{ user?.user_name }}</span>
      </div>
    </div>
    <div class="user-info">
      <div class="user-info-item">
        <span class="label">登录名称：</span>
        <span class="content">{{ user?.login_name }}</span>
      </div>
    </div>
    <div class="user-info">
      <div class="user-info-item">
        <span class="label">用户部门：</span>
        <span class="content">{{ user?.deptName }}</span>
      </div>
    </div>
    <div class="user-info mb-[16px]">
      <div class="user-info-item">
        <span class="label">用户角色：</span>
        <span class="content">{{ user?.roleName }}</span>
      </div>
    </div>
    <BaseButton class="base-button" @click="openSetPasswordDialog"> 设置密码 </BaseButton>
    <BaseButton class="base-button" @click="openSetFingerDialog(1)"> 设置指纹一 </BaseButton>
    <BaseButton class="base-button" @click="openSetFingerDialog(2)"> 设置指纹二 </BaseButton>
    <BaseButton class="base-button" @click="openSetCardDialog"> 设置卡号 </BaseButton>
    <BaseButton class="base-button" @click="openViewDocumentDialog"> 查看文件 </BaseButton>
    <BaseButton class="base-button !mt-[50px]" @click="onManualCheck"> 手动盘点 </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useRfid from '@/hooks/useRfid'
import createAlert from '@/components/BaseAlert'

const store = useStore()
const { resetOperationTimeout } = store
const { user, isChecking, cabinetDoorList } = storeToRefs(store)
const { startInventory } = useRfid()

const setCardVisible = ref(false)
const setPasswordVisible = ref(false)
const setFingerVisible = ref(false)
const viewDocumentVisible = ref(false)
const fingerOrder = ref<FingerOrder>(1)

/**
 * @description: 打开设置密码的弹框
 * @return {*}
 */
const openSetPasswordDialog = () => {
  setPasswordVisible.value = true
}

/**
 * @description: 打开设置指纹的弹框
 * @param {*} order 指纹序号
 * @return {*}
 */
const openSetFingerDialog = (order: FingerOrder) => {
  fingerOrder.value = order
  setFingerVisible.value = true
}

/**
 * @description: 打开设置卡号的弹框
 * @return {*}
 */
const openSetCardDialog = () => {
  setCardVisible.value = true
}

const openViewDocumentDialog = () => {
  viewDocumentVisible.value = true
}

/**
 * @description: 手动盘点
 * @return {*}
 */
const onManualCheck = () => {
  if (isChecking.value) {
    createAlert('正在盘点中，请勿重复点击')
    return
  }

  cabinetDoorList.value.forEach(item => {
    startInventory(item.id)
  })

  resetOperationTimeout()
}
</script>

<style scoped>
.base-button {
  @apply h-[50px] w-[140px] rounded-[4px] text-lg;
}
.base-button + .base-button {
  @apply mt-[16px];
}
.user-info {
  @apply w-full px-[16px] text-base text-white;
}
.user-info-item {
  @apply mb-[8px]  select-none;
}
.user-info-item .span {
  @apply ml-[8px];
}
</style>
