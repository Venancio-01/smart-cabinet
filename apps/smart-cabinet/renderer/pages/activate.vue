<script lang="ts" setup>
import { VActivation } from '@smart-cabinet/components'
import useListenEnter from '@/hooks/useListenEnter'
import createAlert from '@/components/BaseAlert'

const router = useRouter()
const { addListenEnter, removeListenEnter } = useListenEnter()

const registrationCode = ref('')
const activationCode = ref('')

async function handleActive() {
  const code = await window.electronApi.ipcRenderer.invoke('activation:generate-activation-code')

  if (activationCode.value === code) {
    window.electronApi.ipcRenderer.send('store:set', 'activationCode', code)

    createAlert('激活成功')
    router.replace('/index')
  }
  else {
    createAlert('激活失败')
  }
}

onMounted(async () => {
  registrationCode.value = await window.electronApi.ipcRenderer.invoke('activation:generate-registration-code')
  addListenEnter(handleActive)
})

onBeforeMount(() => {
  removeListenEnter(true)
})
</script>

<template>
  <VActivation v-model:activation-code="activationCode" :registration-code="registrationCode" />
</template>
