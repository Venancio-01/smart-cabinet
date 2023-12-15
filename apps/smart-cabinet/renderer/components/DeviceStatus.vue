<script lang="ts" setup>
import { SolutionDialog, VIcon } from '@smart-cabinet/components'
import { useStore } from '@/store'

const store = useStore()
const { misPlaceCarrierTotal, isNetworkConnected, isLockControlConnected, hasUnConnectedRfid } = storeToRefs(store)

const rfidVisible = ref(false)
const lockVisible = ref(false)
const networkVisible = ref(false)
const warnVisible = ref(false)
</script>

<template>
  <div>
    <WarningDialog v-model:visible="warnVisible" />
    <SolutionDialog v-model:visible="rfidVisible" title="RFID状态" content="检查RFID线缆是否正常，并尝试插拔后重新启动软件。" />
    <SolutionDialog v-model:visible="lockVisible" title="锁控状态" content="锁控板连线或供电是否正常，并尝试插拔后重新启动软件。" />
    <SolutionDialog v-model:visible="networkVisible" title="网络状态" content="请检查数据库链接配置是否正常，并重新启动软件。" />

    <div class="flex h-[50px] items-center justify-end gap-4">
      <div v-show="misPlaceCarrierTotal !== 0" class="flex items-center justify-center">
        <VIcon
          icon="warn"
          class="text-icon-normal"
          :class="misPlaceCarrierTotal === 0 ? 'text-light' : 'text-error-color'"
          @click="warnVisible = true"
        />
      </div>

      <div v-show="hasUnConnectedRfid" class="flex items-center justify-center">
        <VIcon icon="RFID" class="text-icon-normal text-error" @click="rfidVisible = true" />
      </div>

      <div v-show="!isLockControlConnected" class="flex items-center justify-center">
        <VIcon icon="lock" class="text-icon-normal text-error" @click="lockVisible = true" />
      </div>

      <div v-show="!isNetworkConnected" class="flex items-center justify-center">
        <VIcon icon="network" class="text-icon-normal text-error" @click="networkVisible = true" />
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
