<template>
  <BaseDialog v-model:visible="show" @close="handleClose" title="身份校验">
    <a-tabs v-model:active-key="activeKey" destroy-inactive-tab-pane>
      <a-tab-pane key="1" tab="密码认证">
        <PasswordAuth class="h-[300px]" ref="passwordAuthRef" is-verify></PasswordAuth>
      </a-tab-pane>
      <a-tab-pane key="2" tab="指纹认证">
        <FingerAuth class="h-[300px]"  @complete="handleFingerComplete"></FingerAuth>
      </a-tab-pane>
      <a-tab-pane key="3" tab="卡号认证">
        <CardAuth class=" h-[300px]" @complete="handleCardComplete"></CardAuth>
      </a-tab-pane>
    </a-tabs>

    <template v-slot:footer v-if="activeKey === '1'">
      <div class="flex justify-end">
        <a-button type="primary" @click="handlePasswordComplete">确认</a-button>
        <a-button  @click="handleClose">关闭</a-button>
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

const store = useStore()
const { setVerifyIdentityDialogVisible } = store
const { verifyIdentityDialogVisible } = storeToRefs(store)
const { resetOperationTimeoutCountdown } = useTime()
const { verifyPassword,verifyFinger,verifyCard } = useSys()
const { closeVerifyIdentityDialog, handleVerificationSuccessful } = useVerify()
const activeKey = ref('1') 

const show = computed({
  get: () => {
    return verifyIdentityDialogVisible.value
  },
  set: value => {
    setVerifyIdentityDialogVisible(value)
  }
})

watch(show, async () => {
  resetOperationTimeoutCountdown()
})

const passwordAuthRef = ref()

const handlePasswordComplete = async () => {
  const result = passwordAuthRef.value?.handleComplete()
  const success = await verifyPassword(result.password)
  if (success) {
    createAlert('身份验证成功')
    handleVerificationSuccessful()
  } else {
    createAlert('身份验证失败')
  }
}

const handleClose = () => {
  closeVerifyIdentityDialog()
}

const handleFingerComplete = (userId:number)=>{
  const result = verifyFinger(userId)
  console.log("🚀 ~ file: VerifyIdentity.vue:71 ~ handleFingerComplete ~ result:", result)
}

const handleCardComplete = (cardNumber:string)=>{
  const result = verifyCard(cardNumber)
  console.log("🚀 ~ file: VerifyIdentity.vue:76 ~ handleCardComplete ~ result:", result)
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
