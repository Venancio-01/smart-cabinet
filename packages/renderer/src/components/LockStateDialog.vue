<template>
  <BaseDialog v-model:visible="show" title="锁控状态">
    <div class="state-bar pt-[20px]">
      <div class="label">当前状态：</div>
      <div class="content">
        {{ lockControlIsOnline ? '连接成功' : '连接失败' }}
      </div>
    </div>

    <div v-if="!lockControlIsOnline" class="state-bar">
      <div class="label">解决方案：</div>
      <div class="content">
        {{ lockControlIsOnline ? '锁控板连接正常' : '锁控板连线或供电是否正常，并尝试插拔后重新启动软件。' }}
      </div>
    </div>

    <template #footer>
      <a-button type="primary" @click="show = false">确 定</a-button>
    </template>
  </BaseDialog>
</template>

<script lang="ts" setup>
import BaseDialog from './BaseDialog.vue'
import { useStore } from '@/store'

type Props = {
  visible: boolean
}
const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emits = defineEmits(['update:visible'])
const store = useStore()
const { lockControlIsOnline } = storeToRefs(store)

const show = computed({
  get: () => {
    return props.visible
  },
  set: value => {
    emits('update:visible', value)
  }
})
</script>

<style scoped>
.state-bar {
  @apply mb-[16px] flex;
}
.state-bar .label {
  @apply w-[70px];
}

.state-bar .content {
  @apply flex-1;
}
</style>
