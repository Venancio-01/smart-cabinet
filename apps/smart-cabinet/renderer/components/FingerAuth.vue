<script lang="ts" setup>
import { VIcon } from 'components'
import useFinger from '@/hooks/useFinger'
import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'

const emits = defineEmits(['complete'])
const store = useStore()
const { isFingerConnected } = storeToRefs(store)
const { openFingerDevice, closeFingerDevice, startIdentifyFinger, stopIdentifyFinger, identifyResult } = useFinger()

const message = ref('请录入指纹')

watch(identifyResult, (value) => {
  if (!value) return
  const { success, msg, data } = value

  if (msg) createAlert(msg)

  if (success && data) {
    const userId = data as number
    emits('complete', userId)
  }
})

onMounted(async () => {
  if (!isFingerConnected.value) {
    message.value = '设备未连接'
    return
  }
  await openFingerDevice()
  startIdentifyFinger()
})

onUnmounted(async () => {
  await closeFingerDevice()
  stopIdentifyFinger()
})
</script>

<template>
  <div flex="~" justify-center items-center>
    <div>
      <div class="flex justify-center">
        <VIcon icon="zhiwen" class="text-[140px] text-white" />
      </div>
      <div class="flex justify-center items-center mt-12">
        {{ message }}
      </div>
    </div>
  </div>
</template>
