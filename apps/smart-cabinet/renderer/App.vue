<script setup lang="ts">
import { Color } from '@smart-cabinet/ui'
import useInit from '@/hooks/useInit'
import { getBackgroundImage } from '@/features/background'

console.log('🚀 ~ file: App.vue:3 ~ Color:', Color)

const backgroundImage = ref('')

onBeforeMount(async () => {
  backgroundImage.value = await getBackgroundImage()
})
useInit()
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: Color.primary,
      },
    }"
  />
  <!-- 盘点倒计时 -->
  <CheckPanel />
  <!-- 身份校验 -->
  <VerifyIdentity />

  <div class="relative h-full w-full items-center justify-center bg-cover" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="w-full h-full mask wrap-padding">
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style></style>
