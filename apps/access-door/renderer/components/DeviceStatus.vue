<script lang="ts" setup>
import { SolutionDialog, VIcon } from '@smart-cabinet/components'
import { Color } from '@smart-cabinet/ui'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { equipmentList, networkIsConnected, unviewedAccessRecordCount, deviceNotFound } = storeToRefs(store)

const networkVisible = ref(false)
const rfidVisible = ref(false)
const deviceVisible = ref(false)

const rfidIsConnected = computed(() => {
  return equipmentList.value.every(item => item.rfidIsConnected)
})

const rfidStatusText = computed(() => {
  const arr: string[] = []

  equipmentList.value.forEach((item) => {
    if (!item.rfidIsConnected) arr.push(`设备：${item.equipmentName} - 读取器连接失败`)
  })

  return arr.join(',')
})

function goRfidRecordPage() {
  router.push({ path: '/rfid-record' })
}
function goWarningRecordPage() {
  router.push({ path: '/alarm-record' })
}
</script>

<template>
  <div>
    <SolutionDialog
      v-model:visible="rfidVisible"
      title="RFID状态"
      :status-text="rfidStatusText"
      content="检查RFID线缆是否正常，并尝试插拔后重新启动软件。"
    />
    <SolutionDialog v-model:visible="networkVisible" title="网络状态" content="请检查数据库链接配置是否正常，并重新启动软件。" />
    <SolutionDialog v-model:visible="deviceVisible" title="未找到通道门" content="请检查数据库通道门配置是否正常，并重新启动软件。" />

    <div class="flex h-[50px] items-center justify-end gap-4">
      <div class="flex items-center justify-center">
        <VIcon icon="record" class="text-icon-normal text-light" @click="goRfidRecordPage" />
      </div>

      <div class="flex items-center justify-center">
        <a-badge :count="unviewedAccessRecordCount" :color="Color.error">
          <div class="flex" @click="goWarningRecordPage">
            <i class="i-solar:danger-circle-linear text-[33px] text-light" />
          </div>
        </a-badge>
      </div>

      <div v-show="!rfidIsConnected" class="flex items-center justify-center">
        <a-badge :dot="!rfidIsConnected" :color="Color.error">
          <VIcon icon="RFID" class="text-icon-normal text-light" @click="rfidVisible = true" />
        </a-badge>
      </div>

      <div v-show="!networkIsConnected" class="flex items-center justify-center">
        <VIcon icon="network" class="text-icon-normal text-error-color" @click="networkVisible = true" />
      </div>

      <div v-show="networkIsConnected && deviceNotFound" class="flex items-center justify-center">
        <VIcon icon="network" class="text-icon-normal text-error-color" @click="deviceVisible = true" />
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
