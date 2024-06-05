<script setup lang="ts">
import { Color } from '@smart-cabinet/ui'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { getBackgroundImage } from '@/features/background'
import useInit from '@/hooks/useInit'

const route = useRoute()
const backgroundImage = ref('')

onMounted(async () => {
  backgroundImage.value = await getBackgroundImage()
})

dayjs.locale('zh-cn')

useInit()
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: Color.primary,
      },
    }" component-size="large" :locale="zhCN"
  >
    <div
      class="relative flex h-full w-full flex-col items-center justify-center bg-cover"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <div class="w-h-full mask wrap-padding">
        <!-- <transition name="fade" mode="out-in"> -->
        <!-- <RouterView > -->
        <RouterView :key="route.fullPath" v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
        <!-- </transition> -->
      </div>
    </div>
  </a-config-provider>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
