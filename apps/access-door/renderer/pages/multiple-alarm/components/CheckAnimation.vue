<script lang="ts" setup>
import { useStore } from '@/store'
import { AccessDirection } from '~/enums'

interface Props {
  direction: AccessDirection
}

const props = withDefaults(defineProps<Props>(), {
  direction: AccessDirection.IN,
})

const router = useRouter()
const store = useStore()
const { loadingVisible, currentReadRecordList } = storeToRefs(store)

const message = computed(() => {
  return props.direction === AccessDirection.IN ? '检测到人员进入' : '检测到人员外出'
})

function goDetail() {
  router.push({
    path: `/record-detail`,
  })
}
</script>

<template>
  <div flex="col" class="w-h-full">
    <div flex="~" items-center justify-center h="260px" text="light center 6xl" font="thin" tracking="10px">
      {{ message }}
    </div>

    <div flex="~ 1">
      <div v-if="loadingVisible" w="full" h="full" flex="~" justify-center items-center>
        <BaseLoading />
      </div>

      <div v-else w="full" h="full" text="light 5xl center" font="thin" tracking="10px">
        <div v-if="currentReadRecordList.length === 0">
          未检测到载体
        </div>

        <div v-else>
          <div>
            {{ `检测到载体数量：${currentReadRecordList.length}` }}
          </div>
          <div flex="~" justify-center items-center>
            <!-- <ViewDetailButton m="t-16" @click="goDetail" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
