<template>
  <BaseDialog v-model:visible="show" title="校验身份" @close="handleClose">
    <div class="flex h-full flex-1 items-center">
      <div class="form-item">
        <div class="label">确认密码</div>
        ：
        <input v-model="password" type="password" />
      </div>
    </div>

    <template v-slot:footer>
      <div class="flex w-full items-center justify-center">
        <BaseButton class="mr-[10px] h-[40px] flex-1 rounded" @click="handleConfirm">确认</BaseButton>
        <BaseButton class="ml-[10px] h-[40px] flex-1 rounded" @click="handleClose">关闭</BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useTime from '@/hooks/useTime'
import useSys from '@/hooks/useSys'
import createAlert from '@/components/BaseAlert'
import useVerify from '@/hooks/useVerify'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emits = defineEmits(['update:visible'])
const store = useStore()
const { changeVerifyIdentityDialogVisible } = store
const { verifyIdentityDialogVisible } = storeToRefs(store)
const { resetOperationTimeoutCountdown } = useTime()
const { verifyPassword } = useSys()
const { closeVerifyIdentityDialog, handleVerificationSuccessful } = useVerify()

const show = computed({
  get: () => {
    return verifyIdentityDialogVisible.value
  },
  set: value => {
    changeVerifyIdentityDialogVisible(value)
  }
})

watch(show, async value => {
  resetOperationTimeoutCountdown()
})

const password = ref('')

const handleConfirm = async () => {
  const result = await verifyPassword(password.value)
  if (result) {
    createAlert('校验成功')
    handleVerificationSuccessful()
  } else {
    createAlert('校验失败')
  }
}

const handleClose = () => {
  password.value = ''
  closeVerifyIdentityDialog()
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
  @apply h-[30px] w-full leading-[30px];
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
