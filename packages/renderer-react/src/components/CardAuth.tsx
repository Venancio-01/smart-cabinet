<template>
  <div class="h-full">
    <img src="@/assets/images/login_card.png" alt="" class="h-[170px] w-full" />
    <input ref="cardNumberInput" v-model="cardNumber" type="password" class="h-[40px] w-full" />
  </div>
</template>

<script lang="ts" setup>
import { CARD_KEY } from '@/config'
import useListenEnter from '@/hooks/useListenEnter'
import useLogin from '@/hooks/useLogin'
import { useStore } from '@/store'

const store = useStore()
const { loginModeIndex } = storeToRefs(store)
const { onCardLogin } = useLogin()
const { addListenEnter, removeListenEnter } = useListenEnter()

const isActive = computed(() => {
  return loginModeIndex.value === CARD_KEY
})

const handleCardLogin = async () => {
  await onCardLogin(cardNumber.value)
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
