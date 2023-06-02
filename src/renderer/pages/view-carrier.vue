<script lang="ts" setup>
import { useStore } from '@/store'
import useViewCarriers from '@/hooks/useViewCarriers'

const route = useRoute()
const store = useStore()
const { cabinetDoorList, departmentList, currentCabinetDoorId } = storeToRefs(store)
const { CarrierTable, getCarriers, data, total } = useViewCarriers()

const condition = reactive<CarrierQueryProps>({
  page: 1,
  size: 8,
  title: '',
  cabinetId: undefined,
  departmentId: undefined,
  state: undefined,
})

async function onPageChange(page: number) {
  condition.page = page

  getCarriers(condition)
}

async function handleSubmit() {
  condition.page = 1

  getCarriers(condition)
}

function handleInit() {
  const state = route.params.state === 'null' ? undefined : Number(route.params.state)

  condition.page = 1
  condition.title = ''
  condition.cabinetId = undefined
  condition.departmentId = undefined
  condition.state = state
  data.value = []

  getCarriers(condition)
}

onMounted(() => {
  handleInit()
})
</script>

<template>
  <div class="h-[50px]">
    <BackButton />
  </div>
  <div class="w-full h-full">
    <div class="flex">
      <a-form
        :model="condition"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
        class="flex-1 grid grid-rows-2 grid-cols-2 gap-x-6"
        autocomplete="off"
      >
        <a-form-item label="载体名称" name="title">
          <a-input v-model:value="condition.title" />
        </a-form-item>

        <a-form-item label="状态" name="title">
          <a-select v-model:value="condition.state" allow-clear>
            <a-select-option :value="0">
              在位
            </a-select-option>
            <a-select-option :value="1">
              借出
            </a-select-option>
            <a-select-option :value="2">
              错放
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-show="currentCabinetDoorId === 0" label="所属柜门" name="title">
          <a-select v-model:value="condition.cabinetId" allow-clear>
            <a-select-option v-for="item in cabinetDoorList" :key="item.id" :value="item.id">
              {{ item.view_name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-show="currentCabinetDoorId === 0" label="所属部门" name="title">
          <a-select v-model:value="condition.departmentId" allow-clear>
            <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">
              {{ item.dept_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div class="w-[180px] flex justify-end">
        <a-button type="primary" @click="handleSubmit">
          搜索
        </a-button>
        <a-button class="ml-4" @click="handleInit">
          重置
        </a-button>
      </div>
    </div>

    <CarrierTable
      :total="total"
      :data="data"
      :condition="{ page: condition.page, size: condition.size }"
      :operable="true"
      @on-page-change="onPageChange"
      @on-data-change="() => getCarriers(condition)"
    />
  </div>
</template>
