<script lang="ts" setup>
import { useStore } from '@/store'
import useCabinet from '@/hooks/useCabinet'

const store = useStore()
const { cabinetDoorList, misPlaceCarrierData } = storeToRefs(store)
const { openCabinetDoor } = useCabinet()

const cabinetDoor = computed(() => {
  return cabinetDoorList.value[0]
})

const misPlaceCarriers = computed(() => {
  return misPlaceCarrierData.value.filter((item) => Number(item.cabinetDoorId) === cabinetDoor.value.id)
})

const hasMisPlace = computed(() => {
  return misPlaceCarriers.value.length > 0
})
</script>

<template>
  <div class="rounded-2xl bg-white bg-opacity-20 text-light flex h-full items-center" @click="() => openCabinetDoor(cabinetDoor)">
    <BaseIcon icon="door" class="text-[240px] flex-1" :class="[hasMisPlace ? 'text-error' : 'text-white']" />
    <div class="flex-1 h- flex flex-col justify-center items-center">
      <div class="-mt-[40px]">
        <div class="font-xl text-center">
          {{ cabinetDoor.viewName }}
        </div>
        <div class="font-xl text-center mt-12">点击开启柜门</div>
      </div>
    </div>
  </div>
</template>
