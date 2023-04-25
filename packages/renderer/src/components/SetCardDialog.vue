<template>
  <BaseDialog v-model:visible="show" title="设置卡号" :footer="null" @close="onClose" >
  <div class="h-full">
    <div class="flex justify-center">
      <BaseIcon icon="card" class="icon-large text-white"></BaseIcon>
    </div>
    <div class="flex justify-center items-center">
      <AnimationInput ref="inputRef" v-model:value="cardNumber" class="w-[500px] mt-[10px]" label="请刷卡设置卡号"></AnimationInput>
    </div>
  </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import useListenEnter from '@/hooks/useListenEnter'
import useCard from '@/hooks/useCard'
import useTime from '@/hooks/useTime'
import AnimationInput from '@/components/AnimationInput.vue'

type Props = {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emits = defineEmits(['update:visible'])
const { addListenEnter, removeListenEnter } = useListenEnter()
const { updateCardNumber } = useCard()
const { resetOperationTimeoutCountdown } = useTime()

const show = computed({
  get: () => {
    return props.visible
  },
  set: value => {
    emits('update:visible', value)
  }
})

const cardNumber = ref('')

// 使输入框聚焦
const inputRef = ref<InstanceType<typeof AnimationInput>>()
const handleFocus = () => {
  inputRef.value?.focus()
}
watch(show, value => {
  resetOperationTimeoutCountdown()

  if (value) {
    addListenEnter(async () => {
      const success = await updateCardNumber(cardNumber.value)
      if (success) {
        emits('update:visible', false)
      }
    })
    nextTick(() => {
      handleFocus()
    })
  } else {
    removeListenEnter(true)
    cardNumber.value = ''
  }
})

const onClose = () => {
  resetOperationTimeoutCountdown()

  cardNumber.value = ''
}
</script>
