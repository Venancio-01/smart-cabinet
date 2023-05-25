<template>
  <div class="h-full">
    <div class="flex justify-center">
      <BaseIcon icon="card" class="icon-large text-white"></BaseIcon>
    </div>
    <div class="flex justify-center items-center">
      <AnimationInput ref="inputRef" v-model:value="cardNumber" class="w-[500px] mt-[10px]" label="请刷卡登录"></AnimationInput>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CARD_KEY } from '@/config'
import useListenEnter from '@/hooks/useListenEnter'
import { useStore } from '@/store'

const emits = defineEmits(['complete'])
const store = useStore()
const { loginModeIndex } = storeToRefs(store)
const { addListenEnter, removeListenEnter } = useListenEnter()

const isActive = computed(() => {
  return loginModeIndex.value === CARD_KEY
})

const handleCardLogin = async () => {
  emits('complete', cardNumber.value)
}

// 监听当前登录方式的变化
watch(
  isActive,
  value => {
    if (value) {
      addListenEnter(handleCardLogin)
      nextTick(() => {
        handleFocus()
      })
    } else {
      removeListenEnter(true)
    }
  },
  {
    immediate: true
  }
)

const cardNumber = ref('')
// 使输入框聚焦
const cardNumberInput = ref<null | HTMLInputElement>(null)
const handleFocus = () => {
  cardNumberInput.value?.focus()
}
</script>
