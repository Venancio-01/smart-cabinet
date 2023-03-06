<template>
  <BaseDialog v-model:visible="show" @close="handleClose">
    <template v-slot:header>
      <div class="tab-bar">
        <div class="tab-item blue-gradient" @click="setActive(0)">密码认证</div>
        <div class="tab-item blue-gradient" @click="setActive(1)">指纹认证</div>
      </div>
    </template>

    <PasswordAuth v-if="active === 0" v-model:value="password"/>
    <FingerAuth v-if="active === 1" :active="active" />

    <template v-slot:footer v-if="active === 0">
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
import useVerify from '@/hooks/useVerify'
import createAlert from '@/components/BaseAlert'
import PasswordAuth from './PasswordAuth.vue'
import FingerAuth from './FingerAuth.vue'

const store = useStore()
const { setVerifyIdentityDialogVisible } = store
const { verifyIdentityDialogVisible } = storeToRefs(store)
const { resetOperationTimeoutCountdown } = useTime()
const { verifyPassword } = useSys()
const { closeVerifyIdentityDialog, handleVerificationSuccessful } = useVerify()

const show = computed({
  get: () => {
    return verifyIdentityDialogVisible.value
  },
  set: value => {
    setVerifyIdentityDialogVisible(value)
  }
})

watch(show, async value => {
  resetOperationTimeoutCountdown()
})

const active = ref(0)

const setActive = (index: number) => {
  active.value = index
}

const password = ref('')

const handleConfirm = async () => {
  const result = await verifyPassword(password.value)
  if (result) {
    createAlert('身份验证成功')
    handleVerificationSuccessful()
  } else {
    createAlert('身份验证失败')
  }
}

const handleClose = () => {
  password.value = ''
  closeVerifyIdentityDialog()
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
