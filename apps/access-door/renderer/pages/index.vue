<script lang="ts" setup>
import { CurrentTime, VTitle } from 'components'
import { SYSTEM_NAME } from '@/config'
import { useStore } from '@/store'
import useDoor from '@/hooks/useDoor'

import DeviceStatus from '@/components/DeviceStatus.vue'

const store = useStore()
const { isControlEquipment, equipmentList } = storeToRefs(store)
const { selectUnviewedAlarmRecordCount } = useDoor()

const deviceName = computed(() => {
  if (isControlEquipment.value) return ''

  return equipmentList?.[0]?.equipmentName
})

const titleClass = 'text-center select-none font-thin tracking-[10px] text-light'

onMounted(() => {
  selectUnviewedAlarmRecordCount()
})
</script>

<template>
  <div class="h-full">
    <!-- 当前时间 -->
    <CurrentTime class="fixed top-[40px] right-[40px]" />

    <!-- 系统名 -->
    <VTitle :title="SYSTEM_NAME" p="t-34"></VTitle>

    <!-- 设备名 -->
    <div :class="titleClass" text="5xl" p="t-28">
      {{ deviceName }}
    </div>

    <!-- 设备状态 -->
    <DeviceStatus class="fixed bottom-[40px] right-[40px]" />
  </div>
</template>

<style scoped>
.card {
  padding: 24px;
  border-radius: 30px;
  background: rgba(250, 250, 250, 0.2);
  box-shadow: 15px 15px 24px #bebebe;
}
</style>
