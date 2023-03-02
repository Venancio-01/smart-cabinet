<template>
  <BaseDialog
    v-model:visible="show"
    :title="misPlaceDocumentTotal === 0 ? '系统告警' : `系统告警（${active} / ${misPlaceDocumentTotal}）`"
    @close="handleClose"
  >
    <div class="h-full">
      <div v-if="misPlaceDocumentTotal === 0" class="flex h-full items-center justify-center text-lg text-white">无告警记录</div>

      <div v-else>
        <div class="flex h-[50px] items-center text-xl text-white">载体错放</div>

        <div class="flex h-[100px] flex-col items-center justify-center text-xl text-white">
          <p>内容：{{ data.content }}</p>
          <p>时间：{{ data.time }}</p>
        </div>

        <div class="flex justify-around">
          <a-button type="text" :disabled="active === 1" @click="active -= 1">上一个</a-button>
          <a-button type="text" :disabled="active === misPlaceDocumentTotal" @click="active += 1">下一个</a-button>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emits = defineEmits(['update:visible'])
const store = useStore()
const { misPlaceDocumentData, misPlaceDocumentTotal } = storeToRefs(store)
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
  if (misPlaceDocumentData.value[active.value - 1]) {
    return {
      content: misPlaceDocumentData.value[active.value - 1].content,
      time: misPlaceDocumentData.value[active.value - 1].datetime
    }
  } else return {}
})

const handleClose = () =>{
  active.value = 1
}
</script>

<style scoped></style>
