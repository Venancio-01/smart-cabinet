<template>
  <div class="">
    <AnimationInput v-model="formState.username" class="w-full my-8" label="请输入账号：" type="text" />

    <AnimationInput v-model="formState.password" class="w-full my-8" label="请输入密码：" type="password" />

    <div class="flex h-[40px] mt-4 items-center justify-center">
      <a-button type="primary" class="h-[35px] w-[375px] text-lg" @click="handleLogin">登录</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useListenEnter from '@/hooks/useListenEnter'
import useLogin, { FormData } from '@/hooks/useLogin'
import { PASSWORD_KEY } from '@/config'

const store = useStore()
const { loginModeIndex } = storeToRefs(store)
const { handlePasswordLogin } = useLogin()
const { addListenEnter, removeListenEnter } = useListenEnter()

const formState = reactive<FormData>({
  username: 'admin',
  password: '123456'
})

const handleLogin = () => {
  handlePasswordLogin(formState)
}

const isActive = computed(() => {
  return loginModeIndex.value === PASSWORD_KEY
})

// 监听当前登录方式的变化
watch(
  isActive,
  value => {
    if (value) {
      addListenEnter(handleLogin)
    } else {
      removeListenEnter(true)
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  addListenEnter(handleLogin)
})
</script>

<style scoped>
.form-item {
  @apply flex items-center;
}
.form-item .label {
  @apply w-[60px] text-white;
}
.form-item input {
  @apply h-[34px] flex-1;
}
.form-item input[type='password'] {
  @apply text-2xl;
}
.form-item + .form-item {
  @apply mt-[16px];
}
</style>
