<template>
  <div class="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center">
    <div
      class="flex h-[300px] w-[400px] flex-col items-center justify-center rounded-md bg-[url('@/assets/images/bj.png')] bg-cover text-xl text-white shadow-[0px_0px_16px] shadow-black"
    >
      <p>柜门盘点中</p>
      <p>剩余时间： {{ checkTime }} 秒</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'

const store = useStore()
const { cabinetDoorList, isChecking } = storeToRefs(store)

const checkTime = computed(() => {
  if (isChecking.value)
    return Math.max(...cabinetDoorList.value.filter(item => item.checkCountDown !== 10).map(item => item.checkCountDown))
  else return 10
})
</script>
