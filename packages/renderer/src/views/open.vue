<template>
  <div class="relative w-full h-full">
    <BackButton />

    <div class="h-[200px] font-2xl flex-center-center">
      <div v-if="lockControlIsOnline" class="text-light font-400 h-full flex-center-center">
        <BaseIcon icon="chenggong" class="mr-4"></BaseIcon>
        <span>柜门已打开</span>
      </div>
      <div v-else class="text-error font-400 h-full flex-center-center">
        <BaseIcon icon="warn" class="text-error mr-4 font-2xl"></BaseIcon>
        <span>锁控板连接异常</span>
      </div>
    </div>

    <CarrierTable
      :data="data"
      :total="total"
      :condition="{ page: condition.page, size: condition.size }"
      @on-page-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useViewCarriers from '@/hooks/useViewCarriers'
import BackButton from '../components/BackButton.vue'

type Props = {
  id: string
}

const props = defineProps<Props>()

const store = useStore()
const { lockControlIsOnline } = storeToRefs(store)
const { CarrierTable, getCarriers, data, total } = useViewCarriers()

const condition = reactive<CarrierQueryProps>({
  page: 1,
  size: 5,
  title: '',
  cabinetId: Number(props.id)
})

const handlePageChange = async (page: number) => {
  condition.page = page

  getCarriers(condition)
}

onMounted(() => {
  getCarriers(condition)
})
</script>
