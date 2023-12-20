<script setup lang="ts">
import { Color } from '@smart-cabinet/ui'
import { getBackgroundImage } from '@/features/background'
import { initCarrierData } from '@/features/carrier'
import { getRfidConnectionStatus } from '@/features/rfid'
import { checkActivationCode } from '@/features/activation'
import { destroyLockControlService, initLockControlService } from '@/features/lock-control'
import { initCabinetData } from '@/features/cabinet'
import { getNetworkConnectStatus } from '@/features/network'
import { initSysData } from '@/features/sys'
import { initFaceEngine, initFaceSDK, onlineActivation } from '@/features/face'

const backgroundImage = ref('')

onMounted(() => {
  initSysData()
  initCarrierData()
  initCabinetData()
  initLockControlService()
  getRfidConnectionStatus()
  getNetworkConnectStatus()
  checkActivationCode()
  initFaceSDK()
  onlineActivation()
  initFaceEngine()
})

onBeforeMount(async () => {
  destroyLockControlService()
  backgroundImage.value = await getBackgroundImage()
})
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: Color.primary,
      },
    }"
  >
    <!-- 盘点倒计时 -->
    <CheckPanel />
    <!-- 身份校验 -->
    <VerifyIdentity />

    <div
      class="relative h-full w-full items-center justify-center bg-cover"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <div class="w-full h-full mask wrap-padding">
        <router-view v-slot="{ Component }">
          <transition mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </a-config-provider>
</template>

<style>
</style>
