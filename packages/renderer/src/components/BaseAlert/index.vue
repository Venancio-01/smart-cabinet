<template>
  <div
    v-if="visible"
    class="fixed top-1/2 left-1/2 z-[999] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center"
  >
    <div class="h-[170px] w-[300px] bg-[#efefef] shadow-[0px_0px_12px]">
      <div class="flex h-[30px] select-none items-center justify-center border-b-[1px] border-[#cccccc] bg-[#f5f6f7] text-lg">
        系统提示
      </div>
      <div class="flex h-[100px]">
        <div class="flex w-[100px] items-center justify-center">
          <img src="@/assets/images/tips.png" alt="tips" class="h-[50px] w-[50px] select-none" />
          <!-- <img src="@/assets/images/success.png" alt="tips" class="h-[50px] w-[50px] select-none" /> -->
        </div>
        <div class="flex flex-1 select-none items-center pr-4">
          {{ text }}
        </div>
      </div>
      <div class="flex h-[40px] items-center justify-end">
        <button
          id="base-alert-close-button"
          class="mr-[12px] mb-[8px] h-[28px] w-[80px] select-none rounded-sm border border-[#ababab] bg-[#f5f5f5] outline-none"
          @click="close(closeAlert)"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useListenEnter from '@/hooks/useListenEnter'

interface Props {
  visible: boolean
  text: string
  close: Function
}

withDefaults(defineProps<Props>(), {
  visible: false,
  text: '',
  close: () => {}
})

const emits = defineEmits(['update:visible'])
const { addListenEnter, removeListenEnter } = useListenEnter()

const closeAlert = () => {
  emits('update:visible', false)
}

onMounted(() => {
  addListenEnter(() => {
    const button = document.querySelector('#base-alert-close-button') as HTMLButtonElement
    button.click()
  })
})

onBeforeUnmount(() => {
  removeListenEnter()
})
</script>
