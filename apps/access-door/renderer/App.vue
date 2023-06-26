<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import useInit from '@/hooks/useInit'
import { getBackgroundImage } from '@/features/background'

const backgroundImage = ref('')

onMounted(async () => {
  backgroundImage.value = await getBackgroundImage()
})

dayjs.locale('zh-cn')

useInit()
</script>

<template>
  <a-config-provider component-size="large" :locale="zhCN">
    <div
      class="relative flex h-full w-full flex-col items-center justify-center bg-cover"
      :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="w-h-full mask wrap-padding">
        <router-view :key="$route.fullPath" v-slot="{ Component }">
          <transition mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </a-config-provider>
</template>

<style></style>
