<script lang="ts" setup>
import { CurrentTime } from '@smart-cabinet/components'
import VIcon from '@smart-cabinet/components/src/VIcon.vue'
import { Color } from '@smart-cabinet/ui'
import { SYSTEM_NAME } from '@/config'
import { useStore } from '@/store'
import useEquipment from '@/hooks/useEquipment'
import DeviceStatus from '@/components/DeviceStatus.vue'
import { EquipmentDetectionResult, EquipmentDetectionState } from '~/enums'
import useRfid from '@/hooks/useRfid'

const router = useRouter()
const store = useStore()
const { setEquipmentList } = store
const { isControlEquipment, equipmentList, controlEquipment, deviceNotFound } = storeToRefs(store)
const { selectUnviewedAlarmRecordCount } = useEquipment()
const { handleSetGPO } = useRfid()

const deviceName = computed(() => {
  if (isControlEquipment.value) return controlEquipment.value?.equipmentName
  return equipmentList.value[0]?.equipmentName
})

const hasAlarm = computed(() => {
  return equipmentList.value.some(item => item.isAlerting)
})

function generateBgColor(equipment: EquipmentProps) {
  if (equipment.detectionResult) {
    if (equipment.detectionResult === EquipmentDetectionResult.EMPTY) {
      return '!bg-green-color'
    }
    else if (equipment.detectionResult === EquipmentDetectionResult.NORMAL) {
      return '!bg-orange-color'
    }
    else if (equipment.detectionResult === EquipmentDetectionResult.ILLEGAL) {
      return '!bg-red-color'
    }
  }
  else {
    if (equipment.detectionState === EquipmentDetectionState.DETECTION_START) {
      return '!bg-blue-color'
    }
    else if (equipment.detectionState === EquipmentDetectionState.DETECTION_COMPLETE) {
      return '!bg-green-color'
    }
  }
}

function handleMuteAll() {
  equipmentList.value.forEach((item) => {
    if (item.isAlerting) {
      handleMuted(item)
    }
  })
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

function goDetail(equipment: EquipmentProps) {
  router.push({ path: `/detail/${equipment.equipmentid}` })
}

onMounted(() => {
  selectUnviewedAlarmRecordCount()
})
</script>

<template>
  <div class="h-full flex-col">
    <div class="flex justify-between">
      <div>
        <div class="flex">
          <div class="select-none font-thin tracking-[10px] text-light text-5xl">
            {{ SYSTEM_NAME }}
          </div>

          <div v-if="hasAlarm" class="btn w-[144px] h-[48px] text-normal ml-10" font="thin" @click="handleMuteAll">
            {{ '停止报警' }}
          </div>
        </div>

        <div class="select-none font-thin tracking-[10px] text-light" text="24px" mt="30px">
          <span v-if="deviceNotFound" text-error>未连接通道门</span>
          <span v-else>{{ deviceName }}</span>
        </div>
      </div>

      <div class="flex gap-x-12px">
        <!-- 当前时间 -->
        <CurrentTime />
      </div>
    </div>

    <div class="flex-1 grid grid-cols-4 gap-16px mt-40px">
      <div
        v-for="(item) in equipmentList" :key="item.equipmentid" class="flex-col justify-between rounded-md bg-white bg-opacity-20 p-4 text-light h-120px transition-all duration-300"
        :class="[generateBgColor(item)]"
        @click="goDetail(item)"
      >
        <div class="flex justify-between content-between h-36px">
          <div class="flex gap-x-10px ">
            <VIcon icon="tongdaomen" class="text-3xl text-light" />
            <div class="text-xl">
              {{ item.equipmentName }}
            </div>
          </div>

          <div class="flex pr-4">
            <i v-show="item.isAlerting && item.detectionState !== EquipmentDetectionState.DETECTION_START" class="i-solar:muted-broken text-33px" @click.stop="handleMuted(item)" />
            <BaseLoading v-show="item.detectionState === EquipmentDetectionState.DETECTION_START" class="w-40px" />
          </div>
        </div>

        <div class="flex items-center relative justify-between h-40px">
          <div class="h-full flex items-center">
            <span v-show="(item.detectionResult === EquipmentDetectionResult.NORMAL || item.detectionResult === EquipmentDetectionResult.ILLEGAL) && item.detectionState === EquipmentDetectionState.DETECTION_COMPLETE">
              检测到载体总数：{{ item.rfidRecordList?.length }}
            </span>
          </div>

          <div v-show="item.detectionState !== EquipmentDetectionState.DETECTION_START" class="bottom-0 flex items-center pr-4 h-full">
            <a-badge :count="item._count.doorAlarmrecord" :color="Color.error">
              <div class="flex">
                <i class="i-solar:danger-circle-linear text-[33px] text-light" />
              </div>
            </a-badge>
          </div>
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
