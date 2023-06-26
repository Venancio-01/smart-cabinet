<script lang="ts" setup>
import type { DocDocument } from 'database'
import { useStore } from '@/store'
import useViewCarriers from '@/hooks/useViewCarriers'

const route = useRoute()
const store = useStore()
const { cabinetDoorList, departmentList, currentCabinetDoorId } = storeToRefs(store)
const { CarrierTable, getCarriers, data, total } = useViewCarriers()

const condition = reactive<Partial<DocDocument>>({
  docName: '',
  cabinetDoorId: undefined,
  deptId: undefined,
  docPStatus: undefined,
})

const pagination = reactive<PaginationType>({
  page: 1,
  size: 7,
})

async function onPageChange(page: number) {
  pagination.page = page

  getCarriers(toRaw(pagination), toRaw(condition))
}

async function handleSearch() {
  pagination.page = 1

  getCarriers(toRaw(pagination), toRaw(condition))
}

function handleInit() {
  const state = route.params.state === 'null' ? undefined : Number(route.params.state)

  pagination.page = 1
  condition.docName = ''
  condition.cabinetId = undefined
  condition.deptId = undefined
  condition.docPStatus = state
  data.value = []

  getCarriers(toRaw(pagination), toRaw(condition))
}

onMounted(() => {
  handleInit()
})
</script>

<template>
  <div class="w-full h-full">
    <div class="flex">
      <a-form
        :model="condition"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
        class="flex-1 grid grid-rows-2 grid-cols-2 gap-x-6"
        autocomplete="off">
        <a-form-item label="载体名称" name="title">
          <a-input v-model:value="condition.docName" />
        </a-form-item>

        <a-form-item label="在位状态" name="title">
          <a-select v-model:value="condition.docPStatus" allow-clear @change="handleSearch">
            <a-select-option :value="0"> 在柜 </a-select-option>
            <a-select-option :value="1"> 领用 </a-select-option>
            <a-select-option :value="2"> 错放 </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-show="currentCabinetDoorId === 0" label="所属柜门" name="title">
          <a-select v-model:value="condition.cabinetId" allow-clear @change="handleSearch">
            <a-select-option v-for="item in cabinetDoorList" :key="item.cabinetId" :value="item.cabinetId">
              {{ item.viewName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-show="currentCabinetDoorId === 0" label="所属部门" name="title">
          <a-select v-model:value="condition.deptId" allow-clear @change="handleSearch">
            <a-select-option v-for="item in departmentList" :key="item.deptId" :value="item.deptId">
              {{ item.deptName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div class="w-[180px] flex justify-end">
        <a-button type="primary" @click="handleSearch"> 搜索 </a-button>
        <a-button class="ml-4" @click="handleInit"> 重置 </a-button>
      </div>
    </div>

    <CarrierTable
      :total="total"
      :data="data"
      :condition="{ page: pagination.page, size: pagination.size }"
      :operable="true"
      @on-page-change="onPageChange"
      @on-data-change="() => getCarriers(pagination, condition)" />
  </div>
</template>
