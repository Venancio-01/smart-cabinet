<script lang="ts" setup>
import { VDialog } from '@smart-cabinet/components'
import { useStore } from '@/store'
import useVerify from '@/hooks/useVerify'
import createAlert from '@/components/BaseAlert'

const store = useStore()
const { setVerifyIdentityDialogVisible } = store
const { verifyIdentityDialogVisible, user } = storeToRefs(store)
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

watch(show, async () => { })

const passwordAuthRef = ref()

async function handlePasswordComplete() {
  const result = passwordAuthRef.value?.handleComplete()
  const { loginName, salt, password } = user.value
  const params = {
    loginName,
    salt: salt || '',
    password: password || '',
    newPassword: result.password,
  }
  const success = await window.electronApi.ipcRenderer.invoke('sys:verify-password', params)
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

function handleCardComplete(cardNumber: string) {
  const result = window.electronApi.ipcRenderer.invoke('sys:verify-card', user.value.userId, cardNumber)
  console.log('🚀 ~ file: VerifyIdentity.vue:76 ~ handleCardComplete ~ result:', result)
}
</script>

<template>
  <VDialog v-model:visible="show" title="身份校验" @close="handleClose">
    <a-tabs v-model:active-key="activeKey" destroy-inactive-tab-pane>
      <a-tab-pane key="1" tab="密码认证">
        <PasswordAuth ref="passwordAuthRef" class="pt-[40px] h-[300px]" is-verify />
      </a-tab-pane>
      <a-tab-pane key="3" tab="卡号认证">
        <CardAuth class="h-[300px]" @complete="handleCardComplete" />
      </a-tab-pane>
    </a-tabs>

    <template #footer>
      <div class="flex justify-end">
        <a-button v-if="activeKey === '1'" type="primary" @click="handlePasswordComplete">
          确认
        </a-button>
        <a-button @click="handleClose">
          关闭
        </a-button>
      </div>
    </template>
  </VDialog>
</template>

<style scoped>
.tab-bar {
  @apply flex h-[40px];
}

.tab-item {
  @apply flex h-[40px] flex-1 cursor-pointer select-none items-center justify-center text-white;
}
</style>
