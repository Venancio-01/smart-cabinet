<template>
  <!-- 查看文件 -->
  <ViewDocumentsDialog></ViewDocumentsDialog>
  <!-- 盘点倒计时 -->
  <CheckPanel v-show="checkStatusDialogVisible"></CheckPanel>

  <div class="relative h-full w-full items-center justify-center bg-cover" :style="{backgroundImage:`url(${backgroundUrl})`}">
    <div class="flex h-[40px] items-center justify-between">
      <!-- 登出倒计时 -->
      <div class="ml-2 select-none text-lg text-white">
        <span v-show="operationTimeoutVisible">{{ operationTimeout }}秒后自动退出 </span>
        <span v-show="confirmTimeoutVisible">{{ confirmTimeout }}秒后自动返回 </span>
      </div>
      <!-- 时间区域 -->
      <div class="mr-2 select-none font-['LCDFont'] text-3xl text-white">{{ currentTime }}</div>
    </div>

    <div class="h-[calc(100vh-90px)]">
      <router-view></router-view>
    </div>

    <!-- 设备状态 -->
    <DeviceStatus class="h-[50px]" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import useTime from '@/hooks/useTime'
import useOnAppOpen from '@/hooks/useOnAppOpen'
import CheckPanel from '@/components/CheckPanel.vue'
import DeviceStatus from '@/components/DeviceStatus.vue'
import ViewDocumentsDialog from '@/components/ViewDocumentsDialog.vue'

const store = useStore()
const {} = store
const { checkStatusDialogVisible,backgroundUrl } = storeToRefs(store)
const { currentTime, operationTimeout, operationTimeoutVisible, confirmTimeout, confirmTimeoutVisible } = useTime()

watch(operationTimeoutVisible, value => {
  console.log(value, 'operationTimeoutVisible')
})

watch(confirmTimeoutVisible, value => {
  console.log(value, 'confirmTimeoutVisible')
})

useOnAppOpen()
</script>

<style></style>
