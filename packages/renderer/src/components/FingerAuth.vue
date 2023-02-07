<template>
  <div class="flex h-full">
    <div class="flex h-full items-center">
      <img class="h-[188px] w-[122px]" :src="FingerGIF" alt="finger" />
    </div>
    <div class="relative m-4 flex flex-1 select-none items-center justify-center rounded-lg border-[2px] border-white text-white">
      <div class="absolute top-[-10px] left-[5px] w-[35px] select-none bg-primary-color text-center text-white">提示</div>
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
const { fingerIsOnline, loginVisible, loginModeIndex } = storeToRefs(store)
const { openFingerDevice, closeFingerDevice, startIdentifyFinger, endIdentifyFinger, identifyResult } = useFinger()
const { onFingerLogin } = useLogin()

const isActive = computed(() => {
  return loginModeIndex.value === FINGER_KEY
})

watch(
  isActive,
  async value => {
    if (value) {
      await openFingerDevice()
      startIdentifyFinger()
    } else {
      await closeFingerDevice()
      endIdentifyFinger()
    }
  },
  {
    immediate: true
  }
)

const message = ref('请录入指纹')
watch(fingerIsOnline, value => {
  if (value) message.value = '请录入指纹'
  else message.value = '设备未连接'
})

// const message = computed(() => {
//   if (fingerIsOnline.value) {
//     if (identifyResult.value?.msg) {
//       return identifyResult.value?.msg
//     } else return '请录入指纹'
//   } else return '设备未连接'
// })

watch(identifyResult, value => {
  if (!value) return
  const { success, msg, data } = value
  if (msg && fingerIsOnline.value) {
    message.value = msg
  }
  if (success && data) {
    const userId = data as number
    onFingerLogin(userId)
  }
})

watch(loginVisible, async value => {
  if (!value) {
    await closeFingerDevice()
    endIdentifyFinger()
  }
})
</script>
