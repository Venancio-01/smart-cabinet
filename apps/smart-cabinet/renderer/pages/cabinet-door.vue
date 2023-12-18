<script lang="ts" setup>
import TheMultiDoor from '@/components/TheMultiDoor/index.vue'
import TheSingleDoor from '@/components/TheSingleDoor.vue'
import CarrierCountStatistics from '@/components/CarrierCountStatistics.vue'
import { useGlobalState } from '@/store'

const { isSingleDoor } = useGlobalState()
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex h-[150px] items-center">
      <CarrierCountStatistics />
    </div>

    <div class="h-[calc(100%-150px)]">
      <TheSingleDoor v-if="isSingleDoor" />
      <TheMultiDoor v-else />
    </div>
  </div>
</template>

<style scoped>
.statistics-wrap {
  @apply flex h-[160px] items-center gap-16;
}
.statistics-count {
  @apply flex flex-col items-center justify-center;
}

.statistics-count span:nth-child(1) {
  @apply text-gray-2 font-['Barlow'] text-[80px];
}

.statistics-count span:nth-child(2) {
  @apply text-light pt-8 text-sm tracking-[2px];
}
</style>
