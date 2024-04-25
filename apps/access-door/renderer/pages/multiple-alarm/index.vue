<script lang="ts" setup>
import CheckAnimation from './components/CheckAnimation.vue'
import AlarmRecord from './components/AlarmRecord.vue'
import { ActiveEquipmentState } from '~/enums'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { setActiveEquipmentList } = store
const { activeEquipmentList } = storeToRefs(store)

const activeKey = ref(0)

function goHome() {
  setActiveEquipmentList([])
  router.replace('/')
}
</script>

<template>
  <div>
    <div class="flex h-[50px] items-center justify-between">
      <BackButton :on-back="goHome" />
      <StopAlarmButton type="all" />
    </div>

    <a-tabs v-model:activeKey="activeKey" size="middle" class="!mt-12px">
      <a-tab-pane v-for="(item, index) in activeEquipmentList" :key="index" :tab="item.equipmentName">
        <ReadRecord />
        <CheckAnimation v-if="item.state === ActiveEquipmentState.CHECKING" :direction="item.direction" />
        <AlarmRecord v-else-if="item.state === ActiveEquipmentState.ALARMING" :data="item.alarmRecordList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>
::v-deep(.ant-tabs-tab) {
  @apply text-large;
}
</style>
