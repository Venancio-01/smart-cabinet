<script lang="ts" setup>
import { CurrentTime, VTitle } from 'components'
import { SYSTEM_NAME } from '@/config'

const router = useRouter()

function goLoginPage() {
  router.push('/login')
}
</script>

<template>
  <div class="relative h-full">
    <!-- 当前时间 -->
    <CurrentTime class="fixed top-[40px] right-[40px]" />
    <!-- 系统名 -->
    <VTitle :title="SYSTEM_NAME" p="t-34" />

    <!-- 开始使用按钮 -->
    <div class="absolute top-1/2 left-1/2 -translate-1/2">
      <StartButton @click="goLoginPage" />
    </div>

    <div class="fixed bottom-[60px] left-1/2 -translate-x-1/2">
      <CarrierCountStatistics class="w-[500px]" />
    </div>

    <div class="fixed bottom-[40px] right-[40px]">
      <DeviceStatus />
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
