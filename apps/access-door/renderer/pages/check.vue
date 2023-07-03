<script lang="ts" setup>
import { useStore } from '@/store'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { setCurrentReadRecordList } = store
const { loadingVisible, currentReadRecordList } = storeToRefs(store)

const message = computed(() => {
  const direction = route.query?.direction

  return direction === '1' ? '检测到人员进入' : '检测到人员外出'
})

function goDetail() {
  router.push({
    path: `/record-detail`,
  })
}

function goHome() {
  setCurrentReadRecordList([])
  router.replace('/index')
}

const timer = ref()
const count = ref(3)
watchEffect(() => {
  if (loadingVisible.value) {
    if (timer.value) clearTimeout(timer.value)
  } else {
    timer.value = window.setInterval(() => {
      count.value -= 1

      if (count.value === 0) {
        goHome()
      }
    }, 1000)
  }
})

onBeforeUnmount(() => {
  if (timer === null) return

  clearTimeout(timer.value)
})
</script>

<template>
  <div flex="col" class="w-h-full">
    <div class="flex h-[50px] items-center justify-between">
      <BackButton :on-back="goHome" />

      <div v-if="!loadingVisible" text="light 2xl" font="thin">{{ count }}秒后返回首页</div>
    </div>

    <div flex="~" items-center justify-center h="260px" text="light center 6xl" font="thin" tracking="10px">
      {{ message }}
    </div>

    <div flex="~ 1">
      <div v-if="loadingVisible" w="full" h="full" flex="~" justify-center items-center>
        <BaseLoading />
      </div>

      <div v-else w="full" h="full" text="light 5xl center" font="thin" tracking="10px">
        <div v-if="currentReadRecordList.length === 0">未检测到载体</div>

        <div v-else>
          <div>
            {{ `检测到载体数量：${currentReadRecordList.length}` }}
          </div>
          <div flex="~" justify-center items-center>
            <ViewDetailButton m="t-16" @click="goDetail" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
