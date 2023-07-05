<script lang="ts" setup>
import { SolutionDialog, VIcon } from 'components'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { equipmentList, networkIsConnected, unviewedAccessRecordCount } = storeToRefs(store)

const rfidVisible = ref(false)
const networkVisible = ref(false)

const rfidIsConnected = computed(() => {
  return equipmentList.value.every((item) => item.rfidIsConnected)
})

const rfidStatusText = computed(() => {
  const arr = []

  equipmentList.value.forEach((item) => {
    if (!item.rfidIsConnected) arr.push(`设备：${item.equipmentName} - 读取器连接失败`)
  })

  return arr.join(',')
})

function goRfidRecordPage() {
  router.push({ path: '/rfid-record' })
}
function goWarningRecordPage() {
  router.push({ path: '/warning-record' })
}
</script>

<template>
  <div>
    <SolutionDialog
      v-model:visible="rfidVisible"
      title="RFID状态"
      :status-text="rfidStatusText"
      content="检查RFID线缆是否正常，并尝试插拔后重新启动软件。" />
    <SolutionDialog v-model:visible="networkVisible" title="网络状态" content="请检查数据库链接配置是否正常，并重新启动软件。" />

    <div class="flex h-[50px] items-center justify-end gap-4">
      <div class="flex items-center justify-center">
        <VIcon icon="record" class="text-icon-normal text-light" @click="goRfidRecordPage" />
      </div>

      <div class="flex items-center justify-center">
        <a-badge :count="unviewedAccessRecordCount">
          <VIcon
            icon="warn"
            class="text-icon-normal"
            :class="[unviewedAccessRecordCount === 0 ? 'text-light' : 'text-error-color']"
            @click="goWarningRecordPage" />
        </a-badge>
      </div>

      <div v-show="!rfidIsConnected" class="flex items-center justify-center">
        <VIcon icon="RFID" class="text-icon-normal text-error-color" @click="rfidVisible = true" />
      </div>

      <div v-show="!networkIsConnected" class="flex items-center justify-center">
        <VIcon icon="network" class="text-icon-normal text-error-color" @click="networkVisible = true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.state-display-area svg {
  @apply mx-2 select-none;
  -webkit-user-drag: none;
}

.card {
  border-radius: 30px;
  background: rgba(250, 250, 250, 0.5);
  box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff;
}
</style>
