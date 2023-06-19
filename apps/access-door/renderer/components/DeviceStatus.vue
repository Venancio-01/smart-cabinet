<script lang="ts" setup>
import RfidStateDialog from './RfidStateDialog.vue'
import NetworkStateDialog from './NetworkStateDialog.vue'
import { useStore } from '@/store'
import BaseIcon from '@/components/BaseIcon.vue'

const router = useRouter()
const store = useStore()
const { rfidIsOnline, networkIsOnline, unviewedAccessRecordCount } = storeToRefs(store)

const rfidVisible = ref(false)
const networkVisible = ref(false)

function goRecordPage() {
  router.push({ path: '/record' })
}
</script>

<template>
  <div>
    <RfidStateDialog v-model:visible="rfidVisible" />
    <NetworkStateDialog v-model:visible="networkVisible" />

    <div class="flex h-[50px] items-center justify-end gap-4">
      <div class="flex items-center justify-center">
        <a-badge :count="unviewedAccessRecordCount">
          <BaseIcon icon="record" class="text-5xl text-light" @click="goRecordPage" />
        </a-badge>
      </div>

      <div v-show="!rfidIsOnline" class="flex items-center justify-center">
        <BaseIcon icon="RFID" class="text-5xl text-error-color" @click="rfidVisible = true" />
      </div>

      <div v-show="!networkIsOnline" class="flex items-center justify-center">
        <BaseIcon icon="network" class="text-5xl text-error-color" @click="networkVisible = true" />
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
