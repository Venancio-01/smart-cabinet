<template>
  <div class="flex h-full flex-col">
    <div class="flex flex-1 items-center">
      <div class="w-full">
        <div class="form-item">
          <div class="label">账号：</div>
          <input v-model="formState.username" type="text" />
        </div>

        <div class="form-item">
          <div class="label">密码：</div>
          <input v-model="formState.password" type="password" />
        </div>
      </div>
    </div>

    <div class="flex h-[40px] items-center justify-center">
      <BaseButton class="h-[35px] w-[375px] text-lg" @click="handleLogin">登录</BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useListenEnter from '@/hooks/useListenEnter'
import useLogin, { FormData } from '@/hooks/useLogin'
import { password_KEY } from '@/config'

const store = useStore()
const { loginModeIndex } = storeToRefs(store)
const { onPasswordLogin } = useLogin()
const { addListenEnter, removeListenEnter } = useListenEnter()

const formState = reactive<FormData>({
  username: 'admin',
  password: '123456'
})

const handleLogin = () => {
  onPasswordLogin(formState)
}

const isActive = computed(() => {
  return loginModeIndex.value === password_KEY
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
