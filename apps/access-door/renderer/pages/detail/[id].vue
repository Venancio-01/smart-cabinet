<script lang="ts" setup>
import AlarmRecord from './components/AlarmRecord.vue'
import RfidRecord from './components/RfidRecord.vue'
import useEquipment from '@/hooks/useEquipment'

const route = useRoute()
const { equipmentList } = useEquipment()
const equipmentId = Number(route.params.id)
const equipment = computed(() => {
  return equipmentList.value.find(item => item.equipmentid === equipmentId)
})
const activeKey = ref('1')
</script>

<template>
  <div class="h-full">
    <div class="text-light text-[28px] flex items-center">
      <BackButton />
      <span class="ml-4">{{ equipment.equipmentName }}</span>
    </div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="出入记录">
        <RfidRecord :id="equipmentId" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="报警记录">
        <AlarmRecord :id="equipmentId" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
