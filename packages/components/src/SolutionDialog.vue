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
    <div class="state-bar pt-[20px]">
      <div class="label">当前状态：</div>
      <div class="content">{{ statusText }}</div>
    </div>

    <div class="state-bar">
      <div class="label">解决方案：</div>
      <div class="content">
        {{ content }}
      </div>
    </div>

    <template #footer>
      <a-button type="primary" @click="show = false"> 确 定 </a-button>
    </template>
  </VDialog>
</template>

<style scoped>
.state-bar {
  @apply mb-[16px] flex;
}
.state-bar .label {
  @apply w-[90px];
}

.state-bar .content {
  @apply flex-1;
}
</style>
