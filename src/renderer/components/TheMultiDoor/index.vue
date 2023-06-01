<script lang="ts" setup>
import CabinetDoor from './CabinetDoor.vue'
import { useStore } from '@/store'
import useCabinet from '@/hooks/useCabinet'

const store = useStore()
const { cabinetDoorList, carrierList, misPlaceCarrierData } = storeToRefs(store)
const { openCabinetDoor } = useCabinet()

/**
 * @description: 生成柜门列表
 * @param {*}
 * @return {*}
 */
const doorList = computed(() => {
  return cabinetDoorList.value.map((door) => {
    const totalCarriers = carrierList.value.filter(item => item.cabinet_door_id === door.id)
    const inPlaceCarriers = totalCarriers.filter(item => item.loan_status === 0)
    const misPlaceCarries = misPlaceCarrierData.value.filter(item => item.cabinet_door_id === door.id)

    return {
      ...door,
      inPlaceCarrierCount: inPlaceCarriers.length,
      totalCarrierCount: totalCarriers.length,
      misPlaceCarrierCount: misPlaceCarries.length,
    }
  })
})
</script>

<template>
  <div class="col-span-2 grid grid-flow-col grid-rows-4 grid-cols-4 gap-4">
    <CabinetDoor
      v-for="(item, index) in doorList"
      :key="index"
      :index="index"
      :name="item.view_name || ''"
      :in-place-number="item.inPlaceCarrierCount"
      :mis-place-number="item.misPlaceCarrierCount"
      :total-number="item.totalCarrierCount"
      :department-name="item.departmentName || ''"
      @click="openCabinetDoor(item)"
    />
  </div>
</template>
