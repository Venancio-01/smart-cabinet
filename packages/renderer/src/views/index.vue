<template>
  <div class="relative flex items-center justify-center h-full">
    <!-- 系统名 -->
    <h1 class="absolute top-[140px] left-1/2 z-10 -translate-x-1/2 select-none text-3xl text-white">智能载体管控系统</h1>
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
  </div>
</template>

<script lang="ts" setup>
import TheLogin from '@/components/TheLogin.vue'
import { useStore } from '@/store'

const store = useStore()
const { setLoginVisible } = store
const { loginVisible, isLoggedIn } = storeToRefs(store)

const openLogin = () => {
  setLoginVisible(true)
}
</script>
