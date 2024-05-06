<script lang="ts" setup>
import VIcon from '@smart-cabinet/components/src/VIcon.vue'
import VDialog from '@smart-cabinet/components/src/VDialog.vue'
import { debounce } from 'lodash-es'
import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import { message } from 'ant-design-vue'
import ipcNames from '#/ipcNames'

const settingVisible = ref(false)
const checked = ref(true)

function handleOpenSettingModal() {
  settingVisible.value = true
}

const handleChange = debounce(async (val: boolean) => {
  await rendererInvoke(ipcNames.config.setAlarmSound, val)
  message.success('设置成功')
}, 300)

onMounted(async () => {
  const alarmSound = await rendererInvoke(ipcNames.config.getAlarmSound)
  console.log('🚀 - onMounted - alarmSound:', alarmSound)
  checked.value = alarmSound
})
</script>

<template>
  <VDialog v-model:visible="settingVisible" title="设置">
    <div p="x-20px y-20px">
      <div flex="~ justify-between">
        <span>是否开启报警铃声</span>
        <div><a-switch v-model:checked="checked" @change="handleChange" /></div>
      </div>
    </div>
    <template #footer />
  </VDialog>
  <VIcon class="fixed bottom-40px left-40px text-icon-normal text-white cursor-pointer" icon="settings" @click="handleOpenSettingModal" />
</template>
