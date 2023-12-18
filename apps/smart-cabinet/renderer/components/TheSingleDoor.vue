<script lang="ts" setup>
import { VIcon } from '@smart-cabinet/components'
import { useGlobalState } from '@/store'
import { openCabinetDoor } from '@/features/cabinet'

const { cabinetDoorList, misPlaceCarrierList } = useGlobalState()

const cabinetDoor = computed(() => {
  return cabinetDoorList.value[0]
})

const misPlaceCarriers = computed(() => {
  return misPlaceCarrierList.value.filter(item => Number(item.doorid) === cabinetDoor.value.id)
})

const hasMisPlace = computed(() => {
  return misPlaceCarriers.value.length > 0
})
</script>

<template>
  <div class="rounded-2xl bg-white bg-opacity-20 text-light flex h-full items-center" @click="() => openCabinetDoor(cabinetDoor)">
    <VIcon icon="door" class="text-[240px] flex-1" :class="[hasMisPlace ? 'text-error' : 'text-white']" />
    <div class="flex-1 h- flex flex-col justify-center items-center">
      <div class="-mt-[40px]">
        <div class="text-48px text-center">
          {{ cabinetDoor.viewName }}
        </div>
        <div class="text-48px text-center mt-12">
          点击开启柜门
        </div>
      </div>
    </div>
  </div>
</template>
@/store/index-old
