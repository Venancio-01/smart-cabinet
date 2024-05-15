<script lang="ts" setup>
import { CurrentTime } from '@smart-cabinet/components'
import VIcon from '@smart-cabinet/components/src/VIcon.vue'
import { SYSTEM_NAME } from '@/config'
import { useStore } from '@/store'
import useEquipment from '@/hooks/useEquipment'
import DeviceStatus from '@/components/DeviceStatus.vue'
import { EquipmentDetectionResult, EquipmentDetectionState } from '~/enums'
import useRfid from '@/hooks/useRfid'

const store = useStore()
const { setEquipmentList } = store
const { isControlEquipment, equipmentList, controlEquipment, deviceNotFound } = storeToRefs(store)
const { selectUnviewedAlarmRecordCount } = useEquipment()
const { handleSetGPO } = useRfid()

const deviceName = computed(() => {
  if (isControlEquipment.value) return controlEquipment.value?.equipmentName
  return equipmentList.value[0]?.equipmentName
})

function generateBgColor(equipment: EquipmentProps) {
  if (equipment.detectionResult) {
    if (equipment.detectionResult === EquipmentDetectionResult.EMPTY) {
      return '!bg-green-200'
    }
    else if (equipment.detectionResult === EquipmentDetectionResult.NORMAL) {
      return '!bg-orange'
    }
    else if (equipment.detectionResult === EquipmentDetectionResult.ILLEGAL) {
      return '!bg-red'
    }
  }
  else {
    if (equipment.detectionState === EquipmentDetectionState.DETECTION_START) {
      return '!bg-blue'
    }
    else if (equipment.detectionState === EquipmentDetectionState.DETECTION_COMPLETE) {
      return '!bg-green'
    }
  }
}

function handleMuted(equipment: EquipmentProps) {
  handleSetGPO(equipment, false)

  const list = equipmentList.value.map((item) => {
    if (item.equipmentid === equipment.equipmentid) {
      return { ...item, isAlerting: false }
    }
    return item
  })
  setEquipmentList(list)
}

onMounted(() => {
  selectUnviewedAlarmRecordCount()
})
</script>

<template>
  <div class="h-full flex-col">
    <div class="flex justify-between">
      <div>
        <div class="select-none font-thin tracking-[10px] text-light text-5xl">
          {{ SYSTEM_NAME }}
        </div>

        <div class="select-none font-thin tracking-[10px] text-light" text="24px" mt="30px">
          <span v-if="deviceNotFound" text-error>未连接通道门</span>
          <span v-else>{{ deviceName }}</span>
        </div>
      </div>

      <div class="flex gap-x-12px">
        <!-- <StopAlarmButton /> -->
        <!-- 当前时间 -->
        <CurrentTime />
      </div>
    </div>

    <div class="flex-1 grid grid-cols-4 gap-16px mt-40px">
      <div
        v-for="(item) in equipmentList" :key="item.equipmentid" class="flex-col rounded-md bg-white bg-opacity-20 p-4 text-light h-100px transition-all duration-300"
        :class="[generateBgColor(item)]"
      >
        <div class="flex justify-between items-center h-36px">
          <div class="flex gap-x-10px ">
            <VIcon icon="tongdaomen" class="text-3xl text-light" />
            <div class="text-xl">
              {{ item.equipmentName }}
            </div>
          </div>

          <div class="flex">
            <i v-show="item.isAlerting && item.detectionState !== EquipmentDetectionState.DETECTION_START" class="i-solar:muted-broken text-2xl" @click="handleMuted(item)" />
            <BaseLoading v-show="item.detectionState === EquipmentDetectionState.DETECTION_START" class="w-36px" />
          </div>
        </div>

        <div class="flex-1 flex items-center">
          <span v-if="item.detectionResult === EquipmentDetectionResult.NORMAL || item.detectionResult === EquipmentDetectionResult.ILLEGAL">
            检测到载体总数：{{ item.rfidRecordList?.length }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex justify-between h-50px">
      <BaseSetting />
      <!-- 设备状态 -->
      <DeviceStatus />
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

.muted-btn {
  @apply !bg-none !outline-none;
}
</style>
