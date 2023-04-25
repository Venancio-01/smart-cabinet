<template>
  <div class="h-full">
    <div class="flex justify-center">
      <BaseIcon icon="zhiwen" class="text-[140px] text-white"></BaseIcon>
    </div>
    <div class="flex justify-center items-center mt-12 text-xl">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import useFinger from '@/hooks/useFinger'

const emits = defineEmits(['complete'])
const { getConnectStatus,openFingerDevice, closeFingerDevice, startIdentifyFinger, endIdentifyFinger, identifyResult } =
  useFinger()

const message = ref('请录入指纹')

watch(identifyResult, value => {
  if (!value) return
  const { success, msg,data } = value

  if(msg) {
    message.value = msg
  }

  if (success && data) {
    const userId = data as number
    emits('complete',userId)
  }
})

const isConnected = ref(false)
onMounted(async () => {
  isConnected.value = await getConnectStatus()

  if(!isConnected.value) {
    message.value = '设备未连接'
    return
  }  
  await openFingerDevice()
  startIdentifyFinger()
})

onUnmounted(async () => {
  await closeFingerDevice()
  endIdentifyFinger()
})
</script>
