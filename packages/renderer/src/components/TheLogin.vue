<template>
  <div class="z-50 flex h-[300px] w-[400px] flex-col bg-primary-color">
    <div class="tab-bar">
      <div class="tab-item blue-gradient" @click="changeLoginModeIndex(password_KEY)">密码认证</div>
      <div class="tab-item blue-gradient" @click="changeLoginModeIndex(FINGER_KEY)">指纹认证</div>
      <div class="tab-item blue-gradient" @click="changeLoginModeIndex(CARD_KEY)">卡片认证</div>
    </div>
    <div class="mx-auto w-[375px] flex-1">
      <PasswordAuth v-show="loginModeIndex === password_KEY"></PasswordAuth>
      <FingerAuth v-show="loginModeIndex === FINGER_KEY"></FingerAuth>
      <CardAuth v-show="loginModeIndex === CARD_KEY"></CardAuth>
    </div>
    <div class="flex h-[40px] items-center justify-center border-t-[1px] border-[#3f84a9]">
      <BaseButton class="h-[35px] w-[375px] text-lg" @click="closeLogin">关闭</BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from './BaseButton.vue'
import PasswordAuth from './PasswordAuth.vue'
import CardAuth from './CardAuth.vue'
import FingerAuth from './FingerAuth.vue'
import { password_KEY, FINGER_KEY, CARD_KEY } from '@/config'
import { useStore } from '@/store'
import useLock from '@/hooks/useLock'

const store = useStore()
const { changeLoginVisible, changeLoginModeIndex } = store
const { loginModeIndex } = storeToRefs(store)


const closeLogin = () => {
  changeLoginModeIndex(password_KEY)
  changeLoginVisible(false)
}

</script>

<style scoped>
.tab-bar {
  @apply flex h-[40px];
}
.tab-item {
  @apply flex h-[40px] flex-1 cursor-pointer select-none items-center justify-center text-white;
}
</style>
