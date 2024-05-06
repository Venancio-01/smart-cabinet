<script lang="ts" setup>
import { CurrentTime } from '@smart-cabinet/components'
import VIcon from '@smart-cabinet/components/src/VIcon.vue'
import { SYSTEM_NAME } from '@/config'
import { useStore } from '@/store'
import useEquipment from '@/hooks/useEquipment'
import DeviceStatus from '@/components/DeviceStatus.vue'
import { EquipmentDetectionState } from '~/enums'

const store = useStore()
const { isControlEquipment, equipmentList, controlEquipment, deviceNotFound } = storeToRefs(store)
const { selectUnviewedAlarmRecordCount } = useEquipment()

const deviceName = computed(() => {
  if (isControlEquipment.value) return controlEquipment.value?.equipmentName
  return equipmentList.value[0]?.equipmentName
})

const classNameMap = {
  [EquipmentDetectionState.DETECTING]: '!bg-blue',
  [EquipmentDetectionState.DETECTED_NO_EXCEPTION]: '!bg-green',
  [EquipmentDetectionState.DETECTED_WITH_NORMAL_CARRIER]: '!bg-orange',
  [EquipmentDetectionState.DETECTED_WITH_ILLEGAL_CARRIER]: '!bg-red',
}

onMounted(() => {
  selectUnviewedAlarmRecordCount()
})
</script>

<template>
  <div class="h-full">
    <!-- 当前时间 -->
    <CurrentTime class="fixed top-[40px] right-[40px]" />

    <div>
      <div class="select-none font-thin tracking-[10px] text-light text-5xl">
        {{ SYSTEM_NAME }}
      </div>

      <div class="select-none font-thin tracking-[10px] text-light" text="24px" mt="30px">
        <span v-if="deviceNotFound" text-error>未连接通道门</span>
        <span v-else>{{ deviceName }}</span>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-16px mt-40px">
      <div
        v-for="(item) in equipmentList" :key="item.equipmentid" class="rounded-md bg-white bg-opacity-20 p-4 text-light min-h-100px transition-all duration-300"
        :class="classNameMap[item.detectionState]"
      >
        <div class="flex justify-between items-center">
          <VIcon icon="tongdaomen" class="text-4xl text-light" />
          <div class="text-xl">
            {{ item.equipmentName }}
          </div>
        </div>

        <div>
          <div class="flex">
            <span v-show="item.detectionState && item.detectionState !== EquipmentDetectionState." class="loading loading-ring bg-white w-40px" />
            <i class="i-solar:muted-broken" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <BaseSetting />
      <!-- 设备状态 -->
      <DeviceStatus class="fixed bottom-[40px] right-[40px]" />
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 24px;
  border-radius: 30px;
  background: rgba(250, 250, 250, 0.2);
  box-shadow: 15px 15px 24px #bebebe;
}
</style>@/hooks/useEquipment
