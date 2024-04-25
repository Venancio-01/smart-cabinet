<script lang="ts" setup>
import CheckAnimation from './components/CheckAnimation.vue'
import CheckResult from './components/CheckResult.vue'
import AlarmPanel from './components/AlarmPanel.vue'
import ReadRecord from './components/ReadRecord.vue'
import { ActiveEquipmentState } from '~/enums'
import { useStore } from '@/store'
import useListenAction from '@/hooks/useListenAction'
import useRfid from '@/hooks/useRfid'

const router = useRouter()
const store = useStore()
const { setActiveEquipmentList, setActiveEquipment } = store
const { activeEquipmentList } = storeToRefs(store)
const { operationTimeoutCountdown, startMountHook } = useListenAction()
const { handleSetGPO } = useRfid()

const activeKey = ref(0)

function goHome() {
  activeEquipmentList.value.forEach(item => handleSetGPO(item, false))
  setActiveEquipmentList([])
  router.replace('/')
}

function handleViewDetail(equipment: ActiveEquipmentProps) {
  setActiveEquipment({ ...equipment, state: ActiveEquipmentState.VIEWING })
}

const hasAlarmEquipment = computed(() => {
  return activeEquipmentList.value.some(item => item.state === ActiveEquipmentState.ALARMING)
})

startMountHook()
</script>

<template>
  <div>
    <div class="flex h-[50px] items-center justify-between">
      <BackButton :on-back="goHome" />

      <div flex="~ items-center gap-x-20px">
        <!-- <StopAlarmButton v-if="hasAlarmEquipment" type="all" /> -->

        <div text="light 2xl" font="thin">
          {{ operationTimeoutCountdown }}秒后返回首页
        </div>
      </div>
    </div>

    <a-tabs v-model:activeKey="activeKey" size="middle" class="!mt-12px">
      <a-tab-pane v-for="(item, index) in activeEquipmentList" :key="index" :tab="item.equipmentName">
        <template v-if="item.state === ActiveEquipmentState.ALARMING">
          <AlarmPanel :equipment="item" @view-detail="() => handleViewDetail(item)" />
        </template>

        <template v-else>
          <CheckAnimation v-if="item.state === ActiveEquipmentState.CHECKING" :equipment="item" />
          <CheckResult v-else-if="item.state === ActiveEquipmentState.CHECKED" :equipment="item" @view-detail="() => handleViewDetail(item)" />
          <ReadRecord v-else-if="item.state === ActiveEquipmentState.VIEWING" :equipment="item" />
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>
::v-deep(.ant-tabs-tab) {
  @apply text-large;
}
</style>
