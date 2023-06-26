<script lang="ts" setup>
import { CurrentTime } from 'components'
import { SYSTEM_NAME } from '@/config'
import StartButton from '@/components/StartButton.vue'
import CarrierCountStatistics from '@/components/CarrierCountStatistics.vue'
import DeviceStatus from '@/components/DeviceStatus.vue'

const router = useRouter()

function goLoginPage() {
  router.push('/login')
}
</script>

<template>
  <div class="relative flex h-full items-center justify-center">
    <div class="w-full h-full flex flex-col">
      <!-- 当前时间 -->
      <CurrentTime class="fixed top-[40px] right-[40px]" />
      <!-- 系统名 -->
      <div class="text-center select-none text-[48px] leading-[48px] pt-[40px] font-thin tracking-[10px] text-white">
        {{ SYSTEM_NAME }}
      </div>

      <!-- 开始使用按钮 -->
      <div class="flex-1 flex justify-center items-center">
        <StartButton @click="goLoginPage" />
      </div>

      <div class="flex justify-center items-center">
        <CarrierCountStatistics class="w-[500px]" />
      </div>

      <div class="fixed bottom-[40px] right-[40px]">
        <DeviceStatus />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 24px;
  border-radius: 30px;
  background: rgba(250, 250, 250, 0.2);
  box-shadow: 15px 15px 24px #bebebe;
}
</style>
