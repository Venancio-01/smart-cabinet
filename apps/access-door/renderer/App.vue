<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useStore } from '@/store'
import useInit from '@/hooks/useInit'

dayjs.locale('zh-cn')

const store = useStore()
const { backgroundUrl } = storeToRefs(store)

useInit()
</script>

<template>
  <a-config-provider component-size="large" :locale="zhCN">
    <div
      class="relative flex h-full w-full flex-col items-center justify-center bg-cover"
      :style="{ backgroundImage: `url(${backgroundUrl})` }">
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
