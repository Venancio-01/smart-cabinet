<script lang="ts" setup>
import { VDialog } from '@smart-cabinet/components'
import { useGlobalState } from '@/store'
import createAlert from '@/components/BaseAlert'

interface Props {
  visible: boolean
}
interface FormState {
  password: string
  repeatPassword: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})
const emits = defineEmits(['update:visible'])

const { user } = useGlobalState()

const loginName = user.value?.loginName || ''

const show = computed({
  get: () => {
    return props.visible
  },
  set: (value) => {
    emits('update:visible', value)
  },
})

const input = ref()
watch(show, () => {
  input.value?.focus()
})

const formState = reactive<FormState>({
  password: '',
  repeatPassword: '',
})

async function handleSave() {
  if (formState.password === '' || formState.repeatPassword === '') {
    createAlert('密码不可为空')
    return
  }
  if (formState.repeatPassword !== formState.password) {
    createAlert('新密码与确认密码不一致，请重新输入')
    return
  }

  const userId = user.value?.userId
  const success = await window.electronApi.ipcRenderer.invoke('sys:update-password', userId, formState.password)
  if (success) createAlert('密码修改成功')
  else createAlert('密码修改失败')

  handleClose()
}

function handleClose() {
  formState.password = ''
  formState.repeatPassword = ''
  emits('update:visible', false)
}
</script>

<template>
  <VDialog v-model:visible="show" title="设置密码" centered @ok="handleSave" @close="handleClose">
    <div class="flex text-lg">
      <span>登录账号：</span>
      <span>{{ loginName }}</span>
    </div>

    <AnimationInput ref="input" v-model:value="formState.password" class="w-full my-8" label="请输入新密码：" type="password" />
    <AnimationInput v-model:value="formState.repeatPassword" class="w-full my-8" label="请确认新密码：" type="password" />
  </VDialog>
</template>

<style scoped>
</style>
