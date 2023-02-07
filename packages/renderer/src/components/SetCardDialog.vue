<template>
  <BaseDialog v-model:visible="show" title="设置卡号" @close="onClose">
    <div class="h-full pt-[10px]">
      <img src="@/assets/images/login_card.png" alt="" class="h-[140px] w-full" />
      <input ref="cardNumberInput" v-model="cardNumber" type="password" class="h-[40px] w-full" />
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import useListenEnter from '@/hooks/useListenEnter'
import useCard from '@/hooks/useCard'
import { useStore } from '@/store'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emits = defineEmits(['update:visible'])
const { addListenEnter, removeListenEnter } = useListenEnter()
const { updateCardNumber } = useCard()
const store = useStore()
const { resetOperationTimeout } = store

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
const cardNumberInput = ref<null | HTMLInputElement>(null)
const handleFocus = () => {
  cardNumberInput.value?.focus()
}
watch(show, value => {
  resetOperationTimeout()
  if (value) {
    addListenEnter(async () => {
      const success = await updateCardNumber(cardNumber.value)
      if (success) {
        emits('update:visible', false)
      }
    })
    nextTick(handleFocus)
  } else {
    removeListenEnter(true)
  }
})

const onClose = () => {
  cardNumber.value = ''
  resetOperationTimeout()
}
</script>

<style scoped>
.form-item {
  @apply flex items-center text-white;
}
.form-item .label {
  @apply h-[30px] w-[120px] text-justify  text-sm leading-[30px];
}
.form-item .label::after {
  content: '';
  display: inline-block;
  padding-left: 100%;
  margin-left: 100%;
}

.form-item input {
  @apply h-[30px] w-full text-black;
}
.form-item input[type='password'] {
  @apply text-2xl;
}
.form-item + .form-item {
  @apply mt-[16px];
}
</style>
