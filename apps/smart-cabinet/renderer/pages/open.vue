<script lang="ts" setup>
import { VIcon } from '@smart-cabinet/components'
import BackButton from '../components/BackButton.vue'
import { useStore } from '@/store'
import useViewCarriers from '@/hooks/useViewCarriers'

interface Props {
  id: string
}

const props = defineProps<Props>()

const store = useStore()
const { isLockControlConnected } = storeToRefs(store)
const { CarrierTable, getCarriers, data, total } = useViewCarriers()

const condition = reactive<CarrierQueryProps>({
  title: '',
  cabinetDoorId: Number(props.id),
})

const pagination = reactive<PaginationType>({
  page: 1,
  size: 5,
})

async function handlePageChange(page: number) {
  pagination.page = page

  getCarrierList()
}

function getCarrierList() {
  getCarriers(toRaw(pagination), toRaw(condition))
}

onMounted(() => {
  getCarrierList()
})
</script>

<template>
  <div class="relative w-full h-full">
    <BackButton />

    <div class="h-[200px] font-2xl flex-center-center">
      <div v-if="isLockControlConnected" class="text-light font-400 h-full flex-center-center">
        <VIcon icon="chenggong" class="mr-4" />
        <span>柜门已打开</span>
      </div>
      <div v-else class="text-error font-400 h-full flex-center-center">
        <VIcon icon="warn" class="text-error mr-4 font-2xl" />
        <span>锁控板连接异常</span>
      </div>
    </div>

    <CarrierTable
      :data="data"
      :total="total"
      :condition="{ page: pagination.page, size: pagination.size }"
      @on-page-change="handlePageChange"
    />
  </div>
</template>
