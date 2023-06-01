<script lang="ts" setup>
import WarningDialog from './WarningDialog.vue'
import RfidStateDialog from './RfidStateDialog.vue'
import LockStateDialog from './LockStateDialog.vue'
import NetworkStateDialog from './NetworkStateDialog.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { useStore } from '@/store'

const store = useStore()
const { rfidIsOnline, misPlaceCarrierTotal, networkIsOnline, lockControlIsOnline } = storeToRefs(store)

const rfidVisible = ref(false)
const lockVisible = ref(false)
const networkVisible = ref(false)
const warnVisible = ref(false)
</script>

<template>
  <div>
    <WarningDialog v-model:visible="warnVisible" />
    <RfidStateDialog v-model:visible="rfidVisible" />
    <LockStateDialog v-model:visible="lockVisible" />
    <NetworkStateDialog v-model:visible="networkVisible" />

    <div class="flex h-[50px] items-center justify-end gap-4">
      <div v-show="misPlaceCarrierTotal !== 0" class="flex items-center justify-center">
        <BaseIcon
          icon="warn"
          class="text-4xl"
          :class="misPlaceCarrierTotal === 0 ? 'text-light' : 'text-error-color'"
          @click="warnVisible = true"
        />
      </div>

      <div v-show="!rfidIsOnline" class="flex items-center justify-center">
        <BaseIcon icon="RFID" class="text-4xl text-error" @click="rfidVisible = true" />
      </div>

      <div v-show="!lockControlIsOnline" class="flex items-center justify-center">
        <BaseIcon icon="lock" class="text-4xl text-error" @click="lockVisible = true" />
      </div>

      <div v-show="!networkIsOnline" class="flex items-center justify-center">
        <BaseIcon icon="network" class="text-4xl text-error" @click="networkVisible = true" />
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
