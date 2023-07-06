<script lang="ts" setup>
import { ALARM_PAGE_STAY_DURATION } from 'utils/config'
import useRfid from '@/hooks/useRfid'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { setCurrentReadRecordList } = store
const { currentReadRecordList, loadingVisible } = storeToRefs(store)
const { handleSetGPO } = useRfid()

function goHome() {
  setCurrentReadRecordList([])
  router.replace('/')
}

function goDetail() {
  handleSetGPO(false)
  router.push({
    path: `/record-detail`,
  })
}

const unregisterCarrier = computed(() => {
  return currentReadRecordList.value.filter((item) => item.isRegister === '0')
})

const timer = ref<number | null>(null)
onMounted(() => {
  timer.value = window.setInterval(() => {
    handleSetGPO(false)
    goHome()
  }, ALARM_PAGE_STAY_DURATION)
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

      <StopAlarmButton />
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
          <div class="btn btn-lg btn-wide text-normal mt-16" font="thin" @click="goDetail">查看详情</div>
        </div>
      </div>
    </div>
  </div>
</template>
