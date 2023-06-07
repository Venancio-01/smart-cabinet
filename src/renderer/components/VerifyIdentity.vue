<script lang="ts" setup>
import { useStore } from '@/store'
import useTime from '@/hooks/useTime'
import useVerify from '@/hooks/useVerify'
import createAlert from '@/components/BaseAlert'

const store = useStore()
const { setVerifyIdentityDialogVisible } = store
const { verifyIdentityDialogVisible, user } = storeToRefs(store)
const { resetOperationTimeoutCountdown } = useTime()
const { closeVerifyIdentityDialog, handleVerificationSuccessful } = useVerify()
const activeKey = ref('1')

const show = computed({
  get: () => {
    return verifyIdentityDialogVisible.value
  },
  set: (value) => {
    setVerifyIdentityDialogVisible(value)
  },
})

watch(show, async () => {
  resetOperationTimeoutCountdown()
})

const passwordAuthRef = ref()

async function handlePasswordComplete() {
  const result = passwordAuthRef.value?.handleComplete()
  const { login_name, salt, password } = user.value
  const params = {
    loginName: login_name,
    salt,
    password,
    newPassword: result.password,
  }
  const success = await window.JSBridge.sys.verifyPassword(params)
  if (success) {
    createAlert('身份验证成功')
    handleVerificationSuccessful()
  }
  else {
    createAlert('身份验证失败')
  }
}

function handleClose() {
  closeVerifyIdentityDialog()
}

function handleFingerComplete(userId: bigint) {
  const result = user.value.user_id === userId
  console.log('🚀 ~ file: VerifyIdentity.vue:71 ~ handleFingerComplete ~ result:', result)
}

function handleCardComplete(cardNumber: string) {
  const result = window.JSBridge.sys.verifyCard(JSON.stringify(user.value), cardNumber)
  console.log('🚀 ~ file: VerifyIdentity.vue:76 ~ handleCardComplete ~ result:', result)
}
</script>

<template>
  <BaseDialog v-model:visible="show" title="身份校验" @close="handleClose">
    <a-tabs v-model:active-key="activeKey" destroy-inactive-tab-pane>
      <a-tab-pane key="1" tab="密码认证">
        <PasswordAuth ref="passwordAuthRef" class="h-[300px]" is-verify />
      </a-tab-pane>
      <a-tab-pane key="2" tab="指纹认证">
        <FingerAuth class="h-[300px]" @complete="handleFingerComplete" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="卡号认证">
        <CardAuth class=" h-[300px]" @complete="handleCardComplete" />
      </a-tab-pane>
    </a-tabs>

    <template v-if="activeKey === '1'" #footer>
      <div class="flex justify-end">
        <a-button type="primary" @click="handlePasswordComplete">
          确认
        </a-button>
        <a-button @click="handleClose">
          关闭
        </a-button>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
.tab-bar {
  @apply flex h-[40px];
}

.tab-item {
  @apply flex h-[40px] flex-1 cursor-pointer select-none items-center justify-center text-white;
}
</style>
