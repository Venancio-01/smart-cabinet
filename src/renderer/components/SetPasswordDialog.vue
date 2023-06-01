<script lang="ts" setup>
import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'
import useSys from '@/hooks/useSys'
import useTime from '@/hooks/useTime'

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
const store = useStore()
const { updateUserPassword } = useSys()
const { user } = storeToRefs(store)
const { resetOperationTimeoutCountdown } = useTime()

const loginName = user.value?.login_name || ''

const show = computed({
  get: () => {
    return props.visible
  },
  set: (value) => {
    emits('update:visible', value)
  },
})

watch(show, () => {
  resetOperationTimeoutCountdown()
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
  const success = await updateUserPassword(formState.password)
  if (success)
    createAlert('密码修改成功')
  else
    createAlert('密码修改失败')

  handleClose()
}

function handleClose() {
  formState.password = ''
  formState.repeatPassword = ''
  emits('update:visible', false)
}
</script>

<template>
  <BaseDialog v-model:visible="show" title="设置密码" @ok="handleSave" @close="handleClose">
    <div class="flex text-lg">
      <span>登录账号：</span>
      <span>{{ loginName }}</span>
    </div>

    <AnimationInput v-model:value="formState.password" class="w-full my-8" label="请输入新密码：" type="password" />
    <AnimationInput v-model:value="formState.repeatPassword" class="w-full my-8" label="请确认新密码：" type="password" />
  </BaseDialog>
</template>

<style scoped>
</style>
