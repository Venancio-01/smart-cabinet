<template>
  <div
    v-if="visible"
    class="fixed top-1/2 left-1/2 z-[99] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center"
  >
    <div class="bg-primary-color shadow-[0px_0px_12px]" :style="{ width: `${width}px`, height: `${height}px` }">
      <slot name="header">
        <div class="flex h-[50px] select-none items-center justify-center border-b-[2px] border-white text-lg text-white">
        {{ title }}
      </div>
      </slot>
      <div
        class="mx-auto select-none"
        :style="{
          width: `${width - 25}px`,
          height: `${height - 110}px`
        }"
      >
        <slot></slot>
      </div>
      <div class="flex h-[60px] items-center justify-center px-[10px]">
        <slot name="footer">
          <BaseButton class="h-[40px] w-full text-lg" @click="emits('update:visible', false)">关闭</BaseButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from './BaseButton.vue'

interface Props {
  visible: boolean
  title: string
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  width: 400,
  height: 300
})

const emits = defineEmits(['update:visible', 'close'])

watch(
  () => props.visible,
  value => {
    if (!value) emits('close')
  }
)
</script>
