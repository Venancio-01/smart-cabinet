<script setup lang="ts">
import { useStore } from '@/store'
import useInit from '@/hooks/useInit'

const store = useStore()
const { backgroundUrl } = storeToRefs(store)

useInit()
</script>

<template>
  <!-- 盘点倒计时 -->
  <CheckPanel />
  <!-- 身份校验 -->
  <VerifyIdentity />

  <div class="relative h-full w-full items-center justify-center bg-cover" :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <div class="w-full h-full mask wrap-padding">
      <!-- <router-view v-slot="{ Component }">
          <transition mode="out-in">
            <component :is="Component" />
          </transition>
      </router-view> -->
      <router-view />
    </div>
  </div>
</template>

<style></style>
