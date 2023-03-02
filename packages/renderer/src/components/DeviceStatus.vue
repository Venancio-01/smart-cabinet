<template>
  <div class="flex w-full items-center justify-between bg-black bg-opacity-30 px-4">
    <WarningDialog v-model:visible="warningVisible"></WarningDialog>
    <RfidStateDialog v-model:visible="rfidVisible"></RfidStateDialog>
    <LockStateDialog v-model:visible="rockVisible"></LockStateDialog>
    <NetworkStateDialog v-model:visible="networkVisible"></NetworkStateDialog>

    <div class="flex h-full select-none items-center text-lg text-white">
      <span class="mr-4"
        >在位载体 / 总载体：
        <span class="text-xl text-blue-400 underline" @click="goCarrierPage">
          {{ inPlaceDocumentTotal }} / {{ documentTotal }}</span>
          </span>
      <span>
          错放载体：
          <span class="text-xl text-blue-400 underline" @click="goCarrierPageWithMisPlace">
            {{ misPlaceDocumentTotal }}
          </span>
        </span>
    </div>
    <div class="state-display-area">
      <img :src="misPlaceDocumentTotal === 0 ? WarningNormalState : WarningFailState" alt="警告" @click="warningVisible = true" />
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

import NetworkNormalState from '@/assets/images/state_network.png'
import NetworkFailState from '@/assets/images/state_network_bad.png'
import RfidNormalState from '@/assets/images/state_rfid.png'
import RfidFailState from '@/assets/images/state_rfid_bad.png'
import RockNormalState from '@/assets/images/state_rock.png'
import RockFailState from '@/assets/images/state_rock_bad.png'
import WarningNormalState from '@/assets/images/state_warning.png'
import WarningFailState from '@/assets/images/state_warning_bad.png'
import useDocument from '@/hooks/useDocument'

const router = useRouter()
const route = useRoute()
const store = useStore()
const {changeReviewDocumentCondition } = store
const { rfidIsOnline, misPlaceDocumentTotal, networkIsOnline, lockControlIsOnline, documentTotal, inPlaceDocumentTotal } =
  storeToRefs(store)
const {} = useDocument()

const rfidVisible = ref(false)
const rockVisible = ref(false)
const networkVisible = ref(false)
const warningVisible = ref(false)


const goCarrierPage = () => {
  const state = null

  router.push(`/carrier/${state}`)
}

const goCarrierPageWithMisPlace = () =>{
  const state = 2

  router.push(`/carrier/${state}`)
}

</script>

<style scoped>
.state-display-area img {
  @apply mx-2 h-[40px] w-[40px] select-none;
  -webkit-user-drag: none;
}
</style>
