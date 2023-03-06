<template>
  <div class="flex h-full">
    <div class="flex h-full items-center">
      <img class="h-[188px] w-[122px]" :src="FingerGIF" alt="finger" />
    </div>
    <div class="relative m-4 flex flex-1 select-none items-center justify-center rounded-lg border-[2px] border-white text-white">
      <div class="bg-primary-color absolute top-[-10px] left-[5px] w-[35px] select-none text-center text-white">提示</div>
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FINGER_KEY } from '@/config'
import useFinger from '@/hooks/useFinger'
import { useStore } from '@/store'
import FingerGIF from '@/assets/images/gif_finger.gif'
import useLogin from '@/hooks/useLogin'

const store = useStore()
const { fingerIsOnline } = storeToRefs(store)
const { openFingerDevice, closeFingerDevice, startIdentifyFinger, endIdentifyFinger, identifyResult } = useFinger()
const { handleFingerLogin } = useLogin()

const message = computed(() => {
  if (!fingerIsOnline.value) return '设备未连接'
  else {
    if (identifyResult.value?.msg) return identifyResult.value.msg
    else return '请录入指纹'
  }
})

watch(identifyResult, value => {
  if (!value) return
  const { success, data } = value

  if (success && data) {
    const userId = data as number
    handleFingerLogin(userId)
  }
})

onMounted(async () => {
  await openFingerDevice()
  startIdentifyFinger()
})

onUnmounted(async () => {
  await closeFingerDevice()
  endIdentifyFinger()
})
</script>
