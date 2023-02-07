<template>
  <div class="absolute top-[40px] left-[5px] z-50 flex h-[calc(100vh-90px)] w-[calc(100vw-10px)] flex-col bg-primary-color">
    <!-- 头部 -->
    <div class="blue-gradient flex h-[50px] items-center justify-between">
      <span class="ml-[20px] select-none text-lg text-white underline">柜门信息</span>
      <span class="mr-[20px] cursor-pointer select-none text-lg text-white underline" @click="onLogout">注销</span>
    </div>

    <div class="flex flex-1">
      <!-- 柜门信息 -->
      <DoorInfoPanel class="flex-1"></DoorInfoPanel>

      <!-- 基本信息 -->
      <ActionPanel></ActionPanel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DoorInfoPanel from './DoorInfoPanel.vue'
import ActionPanel from './ActionPanel.vue'
import useLogin from '@/hooks/useLogin'

const { onLogout } = useLogin()
</script>
