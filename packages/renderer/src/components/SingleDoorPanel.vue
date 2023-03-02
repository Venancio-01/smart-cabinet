<template>
  <div class="relative flex h-full items-center justify-center">
    <div class="absolute top-[10px] right-[10px] flex select-none items-center text-white">
      <div class="bg-door-color mr-[10px] h-[20px] w-[20px]"></div>
      单击打开柜门
    </div>

    <div class="bg-door-color flex h-[300px] w-[400px] border-[4px] border-[#bebebe]" @click="handleClickDoor">
      <div class="flex h-full w-[200px] flex-col items-center justify-center border-r-[3px] border-[#bebebe]">
        <div class="door-info">
          <div class="label">柜门名称</div>
          ：
          <div class="content">{{ cabinetDoor.view_name }}</div>
        </div>
        <div class="door-info">
          <div class="label">载体总数</div>
          ：
          <div class="content">{{ documentTotal }}</div>
        </div>
        <div class="door-info">
          <div class="label">在位数量</div>
          ：
          <div class="content">{{ inPlaceDocumentTotal }}</div>
        </div>
        <div class="door-info">
          <div class="label">错放数</div>
          ：
          <div class="content">{{ misPlaceDocumentTotal }}</div>
        </div>
      </div>
      <div class="relative flex h-full w-[200px] select-none items-center justify-center border-l-[3px] border-[#bebebe]">
        <div class="absolute top-[20px] left-1/2 h-[70px] w-[110px] -translate-x-1/2 bg-[#666666]"></div>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useLock from '@/hooks/useLock'
import useLogin from '@/hooks/useLogin'
import useTime from '@/hooks/useTime'

const store = useStore()
const { changeCabinetDoorData } = store
const { cabinetDoorList, documentTotal, inPlaceDocumentTotal, misPlaceDocumentTotal, rfidIsOnline, lockControlIsOnline } =
  storeToRefs(store)
const { openLock } = useLock()
const { handleLogout } = useLogin()
const { resetOperationTimeoutCountdown } = useTime()

const handleClickDoor = () => {
  resetOperationTimeoutCountdown()

  openLock(cabinetDoor.value.kgbh)
  handleLogout()

  setTimeout(() => {
    changeCabinetDoorData({ ...cabinetDoor.value, isOpen: true })
  }, 1000)
}

const cabinetDoor = computed(() => {
  const door = cabinetDoorList.value[0]
  return door
})

const message = computed(() => {
  if (!rfidIsOnline.value) return '读取器连接异常'
  else if (!lockControlIsOnline.value) return '锁控连接异常'
  else return '柜门状态正常'
})

</script>
<style scoped>
.door-info {
  @apply flex h-[30px] select-none text-lg;
}
.door-info .label {
  @apply w-[80px] text-justify;
}
.door-info .label::after {
  content: '';
  display: inline-block;
  padding-left: 100%;
  margin-left: 100%;
}
</style>
