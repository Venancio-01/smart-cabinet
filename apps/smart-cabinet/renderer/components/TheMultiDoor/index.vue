<script lang="ts" setup>
import { VScrollBar } from '@smart-cabinet/components'
import CabinetDoor from './CabinetDoor.vue'
import { BorrowedState } from '~/enums'
import { useGlobalState } from '@/store'
import { openCabinetDoor } from '@/features/cabinet'

const { cabinetDoorList, carrierList, misPlaceCarrierList } = useGlobalState()

/**
 * @description: 生成柜门列表
 * @param {*}
 * @return {*}
 */
const doorList = computed(() => {
  return cabinetDoorList.value.map((door) => {
    const totalCarriers = carrierList.value.filter(item => item.cabinetDoorId === door.id)
    const inPlaceCarriers = totalCarriers.filter(item => item.docPStatus === BorrowedState.Returned)
    const misPlaceCarries = misPlaceCarrierList.value.filter(item => Number(item.doorid) === door.id)

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
  <VScrollBar>
    <div class="grid grid-cols-4 gap-4">
      <CabinetDoor
        v-for="(item, index) in doorList"
        :key="index"
        :index="index"
        :name="item.viewName || ''"
        :in-place-number="item.inPlaceCarrierCount"
        :mis-place-number="item.misPlaceCarrierCount"
        :total-number="item.totalCarrierCount"
        department-name=""
        @click="openCabinetDoor(item)"
      />
    </div>
  </VScrollBar>
</template>
