<template>
  <div class="flex">
    <div class="flex h-full items-center">
      <BaseIcon icon="zhiwen" class="text-[160px] text-white"></BaseIcon>
    </div>
    <div class="relative m-4 flex flex-1 select-none items-center justify-center rounded-lg text-white">
      <!-- <div class="bg-primary-color absolute top-[-10px] left-[5px] w-[35px] select-none text-center text-white">提示</div> -->
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import useFinger from '@/hooks/useFinger'
import useLogin from '@/hooks/useLogin'

const { openFingerDevice, closeFingerDevice, startIdentifyFinger, endIdentifyFinger, identifyResult } =
  useFinger()
const { handleFingerLogin } = useLogin()

const message = computed(() => {
  if (!isConnected.value) return '设备未连接'
  if (identifyResult.value?.msg) return identifyResult.value.msg
  else return '请录入指纹'
})

watch(identifyResult, value => {
  if (!value) return
  const { success, data } = value

  if (success && data) {
    const userId = data as number
    handleFingerLogin(userId)
  }
})

const isConnected = ref(false)
onMounted(async () => {
  await openFingerDevice()
  if (isConnected.value) {
    await openFingerDevice()
    startIdentifyFinger()
  }
})

onUnmounted(async () => {
  await closeFingerDevice()
  endIdentifyFinger()
})
</script>
