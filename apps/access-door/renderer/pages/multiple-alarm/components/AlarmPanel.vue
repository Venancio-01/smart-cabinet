<script lang="ts" setup>
import useRfid from '@/hooks/useRfid'

interface Props {
  equipment: ActiveEquipmentProps
}

const props = defineProps<Props>()
const emits = defineEmits(['viewDetail'])
const { handleSetGPO } = useRfid()

function viewDetail() {
  handleStopAlarm()
  emits('viewDetail')
}

function handleStopAlarm() {
  handleSetGPO(props.equipment, false)
}

const unregisterCarrier = computed(() => {
  return props.equipment?.readRecordList?.filter(item => item.isRegister === '0')
})
</script>

<template>
  <div class="flex-col w-h-full relative">
    <div flex="~" items-center justify-center h="260px" text="light center 6xl" font="thin" tracking="10px">
      外出时检测到未登记载体
    </div>

    <div flex="~ 1">
      <div v-if="equipment.loading" w="full" h="full" flex="~" justify-center items-center>
        <BaseLoading />
      </div>

      <div v-else w="full" h="full" text="light 5xl center" font="thin">
        <div tracking="10px">
          <div>
            {{ `检测到载体总数：${equipment.readRecordList?.length}` }}
          </div>

          <div m="t-4">
            {{ `未登记载体数量：${unregisterCarrier?.length}` }}
          </div>
        </div>

        <div flex="~" justify-center items-center class="gap-x-50px">
          <div class="btn btn-lg btn-wide text-normal mt-16" font="thin" @click="handleStopAlarm">
            停止报警
          </div>
          <div class="btn btn-lg btn-wide text-normal mt-16" font="thin" @click="viewDetail">
            查看详情
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
