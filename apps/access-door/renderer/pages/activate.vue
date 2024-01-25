<script lang="ts" setup>
import { VActivation } from '@smart-cabinet/components'
import { rendererInvoke, rendererSend } from '@smart-cabinet/utils/renderer'
import useListenEnter from '@/hooks/useListenEnter'
import createAlert from '@/components/BaseAlert'

const router = useRouter()
const { addListenEnter, removeListenEnter } = useListenEnter()

const registrationCode = ref('')
const activationCode = ref('')

async function handleActive() {
  const code = await rendererInvoke('sys:generate-activation-code')

  if (activationCode.value === code) {
    rendererSend('store:set', 'activationCode', activationCode.value)
    createAlert('激活成功')

    router.replace('/')
  }
  else {
    createAlert('激活失败')
  }
}

onMounted(async () => {
  registrationCode.value = await rendererInvoke('sys:generate-registration-code')
  console.log('🚀 ~ onMounted ~ registrationCode:', registrationCode)
  addListenEnter(handleActive)
})

onBeforeMount(() => {
  removeListenEnter(true)
})
</script>

<template>
  <VActivation v-model:activation-code="activationCode" :registration-code="registrationCode" />
</template>
