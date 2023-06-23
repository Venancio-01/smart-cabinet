<script lang="ts" setup>
import { ALARM_PAGE_STAY_DURATION_THRESHOLD } from 'utils/config/renderer'
import useRfid from '@/hooks/useRfid'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { setCurrentReadRecordList } = store
const { currentReadRecordList, loadingVisible } = storeToRefs(store)
const { handleSetGPO } = useRfid()

function goHome() {
  setCurrentReadRecordList([])
  router.replace('/index')
}

const accessId = computed(() => {
  return currentReadRecordList.value?.[0].accessId
})
function goDetail() {
  handleSetGPO(false)
  router.push({
    path: `/record-detail/${accessId.value}/1`,
  })
  setCurrentReadRecordList([])
}

const unregisterCarrier = computed(() => {
  return currentReadRecordList.value.filter((item) => item.isRegister === '0')
})

const timer = ref<number | null>(null)
onMounted(() => {
  handleSetGPO(true)
  timer.value = window.setInterval(() => {
    router.replace('/')
    handleSetGPO(false)
    setCurrentReadRecordList([])
  }, ALARM_PAGE_STAY_DURATION_THRESHOLD)
})

onBeforeUnmount(() => {
  if (timer.value === null) return

  clearInterval(timer.value)
})
</script>

<template>
  <div class="flex-col w-h-full">
    <div class="flex h-[50px] items-center justify-between">
      <BackButton :on-back="goHome" />

      <div
        class="w-[144px] h-[48px] text-light flex-center-center text-lg bg-[rgba(255,255,255,0.1)] rounded-md"
        font="thin"
        @click="() => handleSetGPO(false)">
        停止报警
      </div>
    </div>

    <div flex="~" items-center justify-center h="260px" text="light center 6xl" font="thin" tracking="10px">外出时检测到未登记载体</div>

    <div flex="~ 1">
      <div v-if="loadingVisible" w="full" h="full" flex="~" justify-center items-center>
        <BaseLoading />
      </div>

      <div v-else w="full" h="full" text="light 5xl center" font="thin" tracking="10px">
        <div>
          {{ `检测到载体总数：${currentReadRecordList.length}` }}
        </div>

        <div m="t-4">
          {{ `未登记载体数量：${unregisterCarrier.length}` }}
        </div>

        <div flex="~" justify-center items-center>
          <ViewDetailButton m="t-16" @click="goDetail" />
        </div>
      </div>
    </div>
  </div>
</template>
