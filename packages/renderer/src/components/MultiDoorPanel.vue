<template>
  <div class="relative flex h-full items-center justify-center">
    <!-- 操作栏 -->
    <div class="absolute top-[10px] right-[10px] flex select-none items-center text-white">
      <div class="bg-door-color mr-[10px] h-[20px] w-[20px]"></div>
      单击打开柜门
    </div>

    <!-- 柜门显示区域 -->
    <div class="grid h-[460px] w-[700px] grid-flow-col grid-rows-4 gap-[4px]">
      <div
        v-for="(door, index) in doorList"
        :key="index"
        class="flex w-[180px] border-[1px] border-[#bebebe] bg-white"
        @click="handleClickDoor(door)"
      >
        <div class="relative flex flex-1 items-center justify-center">
          <div class="absolute top-2 left-2">[{{ door.view_name }}]</div>

          <div class="mt-2 flex select-none flex-col items-center justify-center text-sm">
            <p>{{ door.name }}</p>
            <p class="mt-1 text-lg underline">{{ door.inPlaceDocumentCount }} / {{ door.totalDocumentCount }}</p>
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
import { useCheckStore } from '@/store/check'
import useLock from '@/hooks/useLock'
import useTime from '@/hooks/useTime'

const router = useRouter()
const store = useStore()
const { setCabinetDoor } = store
const { cabinetDoorList, documentList, lockControlIsOnline } = storeToRefs(store)
const checkStore = useCheckStore()
const { addLastOperationCabinetDoorRecords } = checkStore
const { openLock } = useLock()
const { resetOperationTimeoutCountdown } = useTime()

const handleClickDoor = (door: CabinetDoorProps) => {
  resetOperationTimeoutCountdown()

  if (lockControlIsOnline) {
    openLock(door.kgbh)
    addLastOperationCabinetDoorRecords(door)

    setTimeout(() => {
      setCabinetDoor({ ...door, isOpen: true })
    }, 1000)
  }

  router.push(`/open/${door.id}`)
}

const doorList = computed(() => {
  return cabinetDoorList.value.map(door => {
    const totalDocuments = documentList.value.filter(item => item.cabinet_door_id === door.id)
    const inPlaceDocuments = totalDocuments.filter(item => item.loan_status === 0)

    return {
      ...door,
      inPlaceDocumentCount: inPlaceDocuments.length,
      totalDocumentCount: totalDocuments.length
    }
  })
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
