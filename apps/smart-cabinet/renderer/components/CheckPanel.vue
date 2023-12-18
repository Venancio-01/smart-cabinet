<script lang="ts" setup>
import { useGlobalState } from '@/store'


const { setCheckStatusDialogVisible } = useGlobalState()
const { checkCountdownDialogVisible, cabinetDoorList, currentCheckCabinetDoorId } = useGlobalState()

const checkCountdown = computed(() => {
  return cabinetDoorList.value.find(item => item.id === currentCheckCabinetDoorId.value)?.checkCountdown
})

watch(checkCountdown, (value) => {
  if (value === 0) setCheckStatusDialogVisible(false)
})
</script>

<template>
  <transition mode="out-in">
    <div
      v-show="checkCountdownDialogVisible"
      class="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center ant-modal-mask"
    >
      <div
        class="flex relative bg-gray-8 bg-opacity-30 backdrop-filter backdrop-blur-[10px] h-[300px] w-[400px] select-none justify-center items-center rounded-lg text-white shadow-[0px_0px_16px] shadow-black"
      >
        <p class="absolute left-1/2 -translate-x-1/2 tracking-wider top-30px">
          柜门盘点中...
        </p>
        <div relative>
          <span class="countdown font-['Barlow'] text-90px">
            <span :style="{ '--value': checkCountdown || 10 }" />
          </span>
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 ml-[60px] mt-[14px]">秒</span>
        </div>
      </div>
    </div>
  </transition>
</template>

