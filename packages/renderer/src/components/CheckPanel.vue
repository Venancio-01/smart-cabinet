<template>
  <div v-show="checkStatusDialogVisible" class="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center">
    <div
      class="flex h-[300px] w-[400px] select-none flex-col items-center justify-center rounded-md bg-cover text-xl text-white shadow-[0px_0px_16px] shadow-black"
      :style="{backgroundImage:`url(${backgroundUrl})`}">
      <p>柜门盘点中</p>
      <p>剩余时间： {{ checkCountdown }} 秒</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'

const store = useStore()
const { changeCheckStatusDialogVisible } = store
const { checkStatusDialogVisible,cabinetDoorList, currentCheckCabinetDoorId,backgroundUrl } = storeToRefs(store)

const checkCountdown = computed(() => {
  return cabinetDoorList.value.find(item => item.id === currentCheckCabinetDoorId.value)?.checkCountdown
})

watch(checkCountdown, value => {
  if (value === 0) {
    changeCheckStatusDialogVisible(false)
  }
})
</script>
