<template>
  <div class="relative flex h-full items-center justify-center">
    <!-- 操作栏 -->
    <div class="absolute top-[10px] right-[10px] flex select-none items-center text-white">
      <a-button type="primary" class="mr-2" @click="onSelectAll">全选</a-button>
      <a-button type="primary" @click="onOpenDoor">打开柜门</a-button>
    </div>

    <!-- 柜门显示区域 -->
    <div class="grid h-[460px] w-[700px] grid-cols-4 gap-1">
      <div
        v-for="(item, index) in cabinetDoorList"
        :key="index"
        class="flex h-[120px] border-[1px] border-[#bebebe] bg-white"
        @click="onClickDoor(item)"
      >
        <div class="relative flex flex-1 items-center justify-center">
          <div class="absolute top-[10px] left-[10px]">
            <a-checkbox v-model:checked="item.isSelected" class="pointer-events-none"></a-checkbox>
          </div>
          <div class="flex select-none flex-col items-center justify-center text-sm">
            <p>{{ item.name }}</p>
            <p>{{ item.inPlaceDocumentCount }} / {{ item.totalDocumentCount }}</p>
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
const { resetOperationTimeout, changeLockCommandInterval, changeCabinetDoorData } = store
const { cabinetDoorList, lockControlIsOnline, departmentList } = storeToRefs(store)
const { openLock } = useLock()
const { onLogout } = useLogin()
const { getDocumentByCabinetId, getInPlaceDocumentCountByCabinetId } = useDocument()

const onClickDoor = (door: any) => {
  door.isSelected = !door.isSelected
}

const onSelectAll = () => {
  cabinetDoorList.value.forEach(item => {
    item.isSelected = true
  })
}

const onOpenDoor = () => {
  resetOperationTimeout()

  const selectedList = cabinetDoorList.value.filter(item => item.isSelected)
  if (selectedList.length === 0) {
    createAlert('请先选择柜门')
    return
  }

  selectedList.forEach(item => {
    openLock(item.kgbh)
    setTimeout(() => {
      changeCabinetDoorData({ ...item, isOpen: true })
    }, 1000)
  })

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

// watch(checkTime, value => {
//   if (value === CHECK_TIME) message.value = '柜门盘点完成'
//   else message.value = `柜门盘点中，剩余${value}秒`
// })
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
