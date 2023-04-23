<template>
  <!-- 盘点倒计时 -->
  <CheckPanel></CheckPanel>
  <!-- 身份校验 -->
  <VerifyIdentity></VerifyIdentity>

  <div class="relative h-full w-full items-center justify-center bg-cover" :style="{ backgroundImage: `url(${backgroundUrl})` }">

    <div class="w-full h-full mask wrap-padding">
    <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import useInit from '@/hooks/useInit'
import CheckPanel from '@/components/CheckPanel.vue'
import VerifyIdentity from '@/components/VerifyIdentity/index.vue'
import DeviceStatus from '@/components/DeviceStatus.vue'

const store = useStore()
const { backgroundUrl } = storeToRefs(store)

useInit()
</script>

<style></style>
