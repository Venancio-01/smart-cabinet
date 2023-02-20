<template>
  <!-- 查看文件 -->
  <ViewDocumentDialog></ViewDocumentDialog>

  <div class="relative flex h-full w-full items-center justify-center bg-[url('@/assets/images/bj.png')] bg-cover">
    <!-- 登出倒计时 -->
    <div v-show="currentTimeVisible" class="absolute top-[4px] left-[8px] select-none text-lg text-white">
      {{ operationTimeout }}秒后自动退出
    </div>
    <!-- 时间区域 -->
    <div class="absolute top-[4px] right-[8px] select-none font-['LCDFont'] text-3xl text-white">{{ currentTime }}</div>
    <!-- 系统名 -->
    <h1 class="absolute top-[190px] left-1/2 z-10 -translate-x-1/2 select-none text-3xl text-white">智能载体管控系统</h1>
    <!-- 开始使用按钮 -->
    <div
      v-if="!loginVisible && !isLoggedIn"
      class="flex h-[95px] w-[135px] cursor-pointer select-none items-center justify-center bg-[url('@/assets/images/btn.png')] bg-cover bg-center bg-no-repeat text-xl text-white"
      @click="openLogin"
    >
      开始使用
    </div>
    <!-- 登录组件 -->
    <TheLogin v-if="loginVisible && !isLoggedIn" />
    <!-- 柜门控制 -->
    <TheMainPanel v-if="isLoggedIn" />
    <!-- 设备状态 -->
    <DeviceStatus />

    <CheckPanel v-show="checkStatusDialogVisible"></CheckPanel>
  </div>
</template>

<script lang="ts" setup>
import CheckPanel from './CheckPanel.vue'
import TheLogin from './TheLogin.vue'
import TheMainPanel from './TheMainPanel.vue'
import DeviceStatus from './DeviceStatus.vue'
import { useStore } from '@/store'
import useTime from '@/hooks/useTime'
import useOnAppOpen from '@/hooks/useOnAppOpen'

const store = useStore()
const { changeLoginVisible } = store
const { loginVisible, isLoggedIn, operationTimeout, checkStatusDialogVisible } = storeToRefs(store)
const { currentTime, currentTimeVisible } = useTime()
useOnAppOpen()

const openLogin = () => {
  changeLoginVisible(true)
}
</script>
