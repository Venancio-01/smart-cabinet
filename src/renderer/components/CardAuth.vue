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

const cardNumber = ref('')
async function handleCardLogin() {
  emits('complete', cardNumber.value)
}

// 监听当前登录方式的变化
watch(
  isActive,
  (value) => {
    if (value) {
      addListenEnter(handleCardLogin)
      nextTick(() => {
        handleFocus()
      })
    }
    else {
      removeListenEnter(true)
    }
  },
  {
    immediate: true,
  },
)

// 使输入框聚焦
const cardNumberInput = ref<null | HTMLInputElement>(null)
function handleFocus() {
  cardNumberInput.value?.focus()
}
</script>

<template>
  <div class="h-full">
    <div class="flex justify-center">
      <BaseIcon icon="card" class="icon-large text-white" />
    </div>
    <div class="flex justify-center items-center">
      <AnimationInput v-model:value="cardNumber" class="w-[500px] mt-[10px]" label="请刷卡登录" />
    </div>
  </div>
</template>
