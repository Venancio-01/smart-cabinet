<template>
  <div class="relative flex h-full items-center justify-center">
    <!-- 操作栏 -->
    <div class="absolute top-[10px] right-[10px] flex select-none items-center text-white">
      <div class="bg-door-color mr-[10px] h-[20px] w-[20px]"></div>
      单击打开柜门
    </div>

    <!-- 柜门显示区域 -->
    <div class="grid h-[460px] w-[700px] grid-cols-4 gap-1">
      <div
        v-for="(door, index) in cabinetDoorList"
        :key="index"
        class="flex h-[120px] border-[1px] border-[#bebebe] bg-white"
        @click="onClickDoor(door)"
      >
        <div class="relative flex flex-1 items-center justify-center">
          <div class="flex select-none flex-col items-center justify-center text-sm">
            <p>{{ door.name }}</p>
            <p>{{ door.inPlaceDocumentCount }} / {{ door.totalDocumentCount }}</p>
          </div>
        </div>
        <div class="w-[40px] border-l-[1px] border-[#bebebe]">
          <div class="m-auto mt-[20px] h-[20px] w-[20px] bg-[#bebebe]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useLock from '@/hooks/useLock'
import useLogin from '@/hooks/useLogin'
import createAlert from '@/components/BaseAlert'
import useDocument from '@/hooks/useDocument'

const store = useStore()
const { resetOperationTimeout, changeCabinetDoorData } = store
const { cabinetDoorList, lockControlIsOnline } = storeToRefs(store)
const { openLock } = useLock()
const { onLogout } = useLogin()

const onClickDoor = (door: CabinetDoorProps) => {
  resetOperationTimeout()
  openLock(door.kgbh)
  changeCabinetDoorData({ ...door, isOpen: true })
  onLogout()
}

const message = ref('柜门状态正常')
watch(
  lockControlIsOnline,
  value => {
    if (!value) message.value = '柜门锁控异常'
  },
  {
    immediate: true
  }
)
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
