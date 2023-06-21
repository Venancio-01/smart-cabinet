<script lang="ts" setup>
import BaseDialog from './BaseDialog.vue'
import { useStore } from '@/store'

interface Props {
  visible: boolean
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
})
const emits = defineEmits(['update:visible'])
const store = useStore()
const { cabinetDoorList } = storeToRefs(store)

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
  <BaseDialog v-model:visible="show" title="RFID状态">
    <div class="state-bar pt-[20px]">
      <div class="label">当前状态：</div>
      <div class="content">
        <div v-for="(item, index) in cabinetDoorList" :key="index">
          柜门 - {{ item.name }} ，RFID 连接{{ item.rfidIsConnected ? '成功' : '失败' }}
        </div>
      </div>
    </div>

    <div class="state-bar">
      <div class="label">解决方案：</div>
      <div class="content">检查RFID线缆是否正常，并尝试插拔后重新启动软件。</div>
    </div>

    <template #footer>
      <a-button type="primary" @click="show = false"> 确 定 </a-button>
    </template>
  </BaseDialog>
</template>

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
