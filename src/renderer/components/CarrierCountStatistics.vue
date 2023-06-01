<script lang="ts" setup>
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { misPlaceCarrierTotal, carrierTotal, inPlaceCarrierTotal } = storeToRefs(store)

function goCarrierPage() {
  const state = null

  router.push(`/main/carrier/${state}`)
}

function goCarrierPageWithInPlace() {
  const state = 0

  router.push(`/main/carrier/${state}`)
}

function goCarrierPageWithMisPlace() {
  const state = 2

  router.push(`/main/carrier/${state}`)
}
</script>

<template>
  <div class="statistics-wrap">
    <div class="statistics-count" @click="goCarrierPage">
      <span class="content">{{ carrierTotal }}</span>
      <span class="title">载体总数</span>
    </div>

    <div class="statistics-count" @click="goCarrierPageWithInPlace">
      <span class="content">{{ inPlaceCarrierTotal }}</span>
      <span class="title">在位载体</span>
    </div>

    <div class="statistics-count" @click="goCarrierPageWithMisPlace">
      <span class="content" :class="misPlaceCarrierTotal === 0 ? 'text-primary-color' : '!text-error-color'">
        {{ misPlaceCarrierTotal }}
      </span>
      <span class="title">错放载体</span>
    </div>
  </div>
</template>

<style scoped>
.statistics-wrap {
  @apply flex items-center gap-16;
}
.statistics-count {
  @apply flex flex-1 flex-col items-center justify-center;
}

.statistics-count span:nth-child(1) {
  @apply text-gray-2 font-['Barlow'] text-2xl;
}

.statistics-count span:nth-child(2) {
  @apply text-light pt-4 tracking-[2px];
}
</style>
