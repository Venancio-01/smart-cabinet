<template>
  <BaseDialog v-model:visible="show" :title="`系统告警（${active} / ${misPlaceDocumentCount}）`">
    <div class="h-full">
      <div class="flex h-[50px] items-center text-xl text-white">文件错放</div>

      <div class="flex h-[100px] flex-col items-center justify-center text-xl text-white">
        <p>内容：{{ data.content }}</p>
        <p>时间：{{ data.time }}</p>
      </div>

      <div class="flex justify-around">
        <a-button type="text" :disabled="active === 1" @click="active -= 1">上一个</a-button>
        <a-button type="text" :disabled="active === misPlaceDocumentCount" @click="active += 1">下一个</a-button>
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
const { misPlaceDocumentData, misPlaceDocumentCount } = storeToRefs(store)
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
</script>

<style scoped></style>
