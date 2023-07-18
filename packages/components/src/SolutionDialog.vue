<script lang="ts" setup>
import { computed } from 'vue'
import VDialog from './VDialog.vue'

interface Props {
  visible: boolean
  title: string
  statusText?: string
  content: string
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  statusText: '连接失败',
  content: '',
})
const emits = defineEmits(['update:visible'])

const show = computed({
  get: () => {
    return props.visible
  },
  set: (value) => {
    emits('update:visible', value)
  },
})
</script>

<template>
  <VDialog v-model:visible="show" :title="title">
    <div class="mb-[16px] pt-[20px] flex">
      <div class="w-[90px]">当前状态：</div>
      <div class="flex-1">{{ statusText }}</div>
    </div>

    <div class="mb-[16px] flex">
      <div class="w-[90px]">解决方案：</div>
      <div class="flex-1">
        {{ content }}
      </div>
    </div>

    <template #footer>
      <a-button type="primary" @click="show = false"> 确 定 </a-button>
    </template>
  </VDialog>
</template>

<style scoped></style>
