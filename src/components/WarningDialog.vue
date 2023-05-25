<template>
  <BaseDialog
    v-model:visible="show"
    :title="misPlaceCarrierTotal === 0 ? '系统告警' : `系统告警（${active} / ${misPlaceCarrierTotal}）`"
    @close="handleClose"
  >
    <div class="h-full">
      <div v-if="misPlaceCarrierTotal === 0" class="flex h-full items-center justify-center text-lg">无告警记录</div>

      <div v-else>
        <div class="flex h-[50px] items-center text-xl">载体错放</div>

        <div class="flex h-[100px] flex-col items-center justify-center text-xl">
          <p>内容：{{ data.content }}</p>
          <p>时间：{{ data.time }}</p>
        </div>

        <div class="flex justify-around">
          <a-button type="text" class="!text-light" :disabled="active === 1" @click="active -= 1">上一个</a-button>
          <a-button type="text" class="!text-light" :disabled="active === misPlaceCarrierTotal" @click="active += 1">下一个</a-button>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" @click="show = false">确 定</a-button>
    </template>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'

type Props = {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emits = defineEmits(['update:visible'])
const store = useStore()
const { misPlaceCarrierData,misPlaceCarrierTotal } = storeToRefs(store)
const show = computed({
  get: () => {
    return props.visible
  },
  set: value => {
    emits('update:visible', value)
  }
})

const active = ref(1)

const data = computed(() => {
  if (misPlaceCarrierData.value[active.value - 1]) {
    return {
      content: misPlaceCarrierData.value[active.value - 1].content,
      time: misPlaceCarrierData.value[active.value - 1].datetime
    }
  } else return {}
})

const handleClose = () => {
  active.value = 1
}
</script>

<style scoped></style>
