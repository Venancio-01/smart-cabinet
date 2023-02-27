<template>
  <BaseDialog v-model:visible="show" title="设置密码">
    <div class="flex flex-1 items-center">
      <div class="mx-auto w-[300px]">
        <div class="form-item pt-[20px]">
          <div class="label">登录账号</div>
          ：
          <div>{{ loginName }}</div>
        </div>

        <div class="form-item">
          <div class="label">新密码</div>
          ：
          <input v-model="formState.password" type="password" />
        </div>

        <div class="form-item">
          <div class="label">再次确认</div>
          ：
          <input v-model="formState.repeatPassword" type="password" />
        </div>
      </div>
    </div>

    <template v-slot:footer>
      <div class="flex w-full items-center justify-center">
        <BaseButton class="mr-[10px] h-[40px] flex-1 rounded" @click="onSave">保存</BaseButton>
        <BaseButton class="ml-[10px] h-[40px] flex-1 rounded" @click="onClose">关闭</BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>

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
  visible: false
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
  set: value => {
    emits('update:visible', value)
  }
})

watch(show, () => {
  resetOperationTimeoutCountdown()
})

const formState = reactive<FormState>({
  password: '',
  repeatPassword: ''
})

const onSave = async () => {
  if (formState.password === '' || formState.repeatPassword === '') {
    createAlert('密码不可为空')
    return
  }
  if (formState.repeatPassword !== formState.password) {
    createAlert('新密码与确认密码不一致，请重新输入')
    return
  }
  const success = await updateUserPassword(formState.password)
  if (success) {
    createAlert('密码修改成功')
  } else {
    createAlert('密码修改失败')
  }
  onClose()
}

const onClose = () => {
  formState.password = ''
  formState.repeatPassword = ''
  emits('update:visible', false)
}
</script>

<style scoped>
.form-item {
  @apply flex items-center text-white;
}
.form-item .label {
  @apply h-[30px] w-[120px] text-justify  text-sm leading-[30px];
}
.form-item .label::after {
  content: '';
  display: inline-block;
  padding-left: 100%;
  margin-left: 100%;
}

.form-item > div {
  @apply h-[30px] leading-[30px] w-full;
}

.form-item input {
  @apply h-[30px] w-full bg-white text-black;
}
.form-item input[type='password'] {
  @apply text-2xl;
}
.form-item + .form-item {
  @apply mt-[16px];
}
</style>
