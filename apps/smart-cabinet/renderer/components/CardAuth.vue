<script lang="ts" setup>
import { VIcon } from '@smart-cabinet/components'
import useListenEnter from '@/hooks/useListenEnter'

const emits = defineEmits(['complete'])
const { addListenEnter, removeListenEnter } = useListenEnter()

const cardNumber = ref('')
async function handleCardLogin() {
  emits('complete', cardNumber.value)
}

onMounted(() => {
  addListenEnter(handleCardLogin)
  nextTick(() => {
    handleFocus()
  })
})

onBeforeUnmount(() => {
  removeListenEnter(true)
})

// 使输入框聚焦
const cardNumberInput = ref<null | HTMLInputElement>(null)
function handleFocus() {
  cardNumberInput.value?.focus()
}
</script>

<template>
  <div flex="~" items-center>
    <div class="">
      <div class="flex justify-center">
        <VIcon icon="card" class="icon-large text-white" />
      </div>
      <div class="flex justify-center items-center">
        <AnimationInput ref="cardNumberInput" v-model:value="cardNumber" class="w-[500px] mt-[10px]" label="请刷卡登录" />
      </div>
    </div>
  </div>
</template>
