<template>
  <WarningDialog v-model:visible="warningVisible"></WarningDialog>
  <RfidStateDialog v-model:visible="rfidVisible"></RfidStateDialog>
  <LockStateDialog v-model:visible="rockVisible"></LockStateDialog>
  <NetworkStateDialog v-model:visible="networkVisible"></NetworkStateDialog>

  <div class="absolute bottom-0 left-0 flex h-[50px] w-full items-center justify-between bg-black bg-opacity-30 px-4">
    <div class="flex h-full select-none items-center text-lg text-white">
      <span>文件总数：{{ count }}，</span>
      <span>错放数：{{ misPlaceDocumentCount }}</span>
    </div>
    <div class="state-display-area">
      <img :src="misPlaceDocumentCount === 0 ? WarningNormalState : WarningFailState" alt="警告" @click="onShowWarning" />
      <img :src="rfidIsOnline ? RfidNormalState : RfidFailState" alt="Rfid状态" @click="rfidVisible = true" />
      <img :src="lockControlIsOnline ? RockNormalState : RockFailState" alt="锁控板状态" @click="rockVisible = true" />
      <img :src="networkIsOnline ? NetworkNormalState : NetworkFailState" alt="网络连接状态" @click="networkVisible = true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import WarningDialog from './WarningDialog.vue'
import RfidStateDialog from './RfidStateDialog.vue'
import LockStateDialog from './LockStateDialog.vue'
import NetworkStateDialog from './NetworkStateDialog.vue'
import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'

import NetworkNormalState from '@/assets/images/state_network.png'
import NetworkFailState from '@/assets/images/state_network_bad.png'
import RfidNormalState from '@/assets/images/state_rfid.png'
import RfidFailState from '@/assets/images/state_rfid_bad.png'
import RockNormalState from '@/assets/images/state_rock.png'
import RockFailState from '@/assets/images/state_rock_bad.png'
import WarningNormalState from '@/assets/images/state_warning.png'
import WarningFailState from '@/assets/images/state_warning_bad.png'
import useDocument from '@/hooks/useDocument'

const store = useStore()
const { rfidIsOnline, misPlaceDocumentCount, networkIsOnline, lockControlIsOnline } = storeToRefs(store)
const { getAllDocumentCount } = useDocument()

const rfidVisible = ref(false)
const rockVisible = ref(false)
const networkVisible = ref(false)
const warningVisible = ref(false)

const onShowWarning = () => {
  if (misPlaceDocumentCount.value === 0) {
    createAlert('无告警记录')
    return
  }
  warningVisible.value = true
}

const count = ref(0)
onMounted(async () => {
  count.value = await getAllDocumentCount()
})
</script>

<style scoped>
.state-display-area img {
  @apply mx-2 h-[40px] w-[40px] select-none;
  -webkit-user-drag: none;
}
</style>
