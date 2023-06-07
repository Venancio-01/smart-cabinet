<script lang="ts" setup>
import useListenEnter from '@/hooks/useListenEnter'
import type { PasswordLoginType } from '@/hooks/useLogin'

interface Props {
  isVerify: boolean
}

withDefaults(defineProps<Props>(), {
  isVerify: false,
})
const emits = defineEmits(['complete'])
const { addListenEnter, removeListenEnter } = useListenEnter()

const formState = reactive<PasswordLoginType>({
  username: 'test',
  password: '123456',
})

function handleComplete() {
  emits('complete', formState)
  return formState
}
defineExpose({
  handleComplete,
})

onMounted(() => {
  addListenEnter(handleComplete)
})

onBeforeUnmount(() => {
  removeListenEnter(true)
})
</script>

<template>
  <div class="">
    <AnimationInput v-if="!isVerify" v-model:value="formState.username" class="w-full my-8" label="请输入账号：" type="text" />

    <AnimationInput v-model:value="formState.password" class="w-full my-8" label="请输入密码：" type="password" />

    <div v-if="!isVerify" class="flex mt-4 items-center justify-center">
      <a-button type="primary" size="large" class="w-full" @click="handleComplete">
        登录
      </a-button>
    </div>
  </div>
</template>

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
