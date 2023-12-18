<script lang="ts" setup>
import dayjs from 'dayjs'
import { VDialog } from '@smart-cabinet/components'
import { useGlobalState } from '@/store'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})
const emits = defineEmits(['update:visible'])

const { misPlaceCarrierList, misPlaceCarrierTotal } = useGlobalState()
const show = computed({
  get: () => {
    return props.visible
  },
  set: (value) => {
    emits('update:visible', value)
  },
})

const active = ref(1)

const data = computed(() => {
  if (misPlaceCarrierList.value[active.value - 1]) {
    const time = misPlaceCarrierList.value?.[active.value - 1]?.createDate
    return {
      content: misPlaceCarrierList.value[active.value - 1].content,
      time: time && dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    }
  }
  else {
    return {}
  }
})

function handleClose() {
  active.value = 1
}
</script>

<template>
  <VDialog
    v-model:visible="show"
    :title="misPlaceCarrierTotal === 0 ? '系统告警' : `系统告警（${active} / ${misPlaceCarrierTotal}）`"
    @close="handleClose"
  >
    <div class="h-full">
      <div v-if="misPlaceCarrierTotal === 0" class="flex h-full items-center justify-center">
        无告警记录
      </div>

      <div v-else>
        <div class="flex h-[50px] items-center">
          载体错放
        </div>

        <div class="flex h-[100px] flex-col items-center justify-center">
          <p>内容：{{ data.content }}</p>
          <p>时间：{{ data.time }}</p>
        </div>

        <div class="flex justify-around">
          <a-button type="text" class="!text-light" :disabled="active === 1" @click="active -= 1">
            上一个
          </a-button>
          <a-button type="text" class="!text-light" :disabled="active === misPlaceCarrierTotal" @click="active += 1">
            下一个
          </a-button>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" @click="show = false">
        确 定
      </a-button>
    </template>
  </VDialog>
</template>

<style scoped></style>
@/store/index-old
