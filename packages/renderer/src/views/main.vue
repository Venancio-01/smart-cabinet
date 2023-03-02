<template>
  <div class="bg-primary-color mx-1 flex h-full flex-col">
    <!-- 头部 -->
    <div class="blue-gradient flex h-[50px] items-center justify-between">
      <span>
        <span class="ml-[20px] select-none text-lg text-white underline">柜门信息</span>
        <span class="ml-[20px] select-none text-lg text-white" @click="goCarrierPage">载体信息</span>
      </span>
      <span class="mr-[20px] cursor-pointer select-none text-lg text-white underline" @click="handleLogout">注销</span>
    </div>

    <div class="flex flex-1">
      <!-- 柜门信息 -->
      <SingleDoorPanel v-if="isSingleDoor" class="flex-1"></SingleDoorPanel>
      <MultiDoorPanel v-else class="flex-1"></MultiDoorPanel>

      <!-- 基本信息 -->
      <ActionPanel></ActionPanel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useLogin from '@/hooks/useLogin'
import SingleDoorPanel from '@/components/SingleDoorPanel.vue'
import MultiDoorPanel from '@/components/MultiDoorPanel.vue'
import ActionPanel from '@/components/ActionPanel.vue'
import useTime from '@/hooks/useTime'

const router = useRouter()
const store = useStore()
const { isSingleDoor } = storeToRefs(store)
const { handleLogout } = useLogin()
const {resetOperationTimeoutCountdown} = useTime()

const goCarrierPage = () =>{
  resetOperationTimeoutCountdown()
  router.push('/carrier/null')
}
</script>
