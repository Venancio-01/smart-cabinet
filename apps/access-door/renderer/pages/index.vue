<script lang="ts" setup>
import { VTitle } from 'components'
import { SYSTEM_NAME } from '@/config'
import { useStore } from '@/store'
import useTime from '@/hooks/useTime'
import useDoor from '@/hooks/useDoor'

import DeviceStatus from '@/components/DeviceStatus.vue'

const store = useStore()
const { currentAccessDoorDevice } = storeToRefs(store)
const { currentTime } = useTime()
const { fetchUnviewedAccessRecordCount } = useDoor()

const deviceName = computed(() => currentAccessDoorDevice.value?.equipmentName)

const titleClass = 'text-center select-none font-thin tracking-[10px] text-light'

onMounted(() => {
  fetchUnviewedAccessRecordCount()
})
</script>

<template>
  <div class="h-full">
    <!-- 当前时间 -->
    <div class="fixed top-[40px] right-[40px] text-light text-4xl" font="thin">
      {{ currentTime }}
    </div>

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
