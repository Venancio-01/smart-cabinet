<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { Prisma, SysDept } from '@smart-cabinet/database'

const condition = reactive<DepartmentQueryProps>({
  deptName: '',
})
const pagination = reactive<PaginationType>({
  page: 1,
  size: 5,
})

const data = ref<SysDept[]>([])
const total = ref(0)
const columns: ColumnsType = [
  {
    title: '机构名称',
    dataIndex: 'deptName',
    key: 'deptName',
  },
]

async function onPageChange(page: number) {
  pagination.page = page

  getDepartmentList()
}

async function handleSearch() {
  pagination.page = 1

  getDepartmentList()
}

function handleInit() {
  pagination.page = 1
  condition.deptName = ''
  data.value = []

  getDepartmentList()
}

async function getDepartmentList() {
  const query: Prisma.SysDeptWhereInput = {
    deptName: condition.deptName ? { contains: condition.deptName } : undefined,
  }

  const { data: _data, total: _total } = await window.JSBridge.sys.selectSysDeptListWithPage(toRaw(pagination), query)
  data.value = _data
  total.value = _total
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
        autocomplete="off"
      >
        <a-form-item label="机构名称">
          <a-input v-model:value="condition.deptName" />
        </a-form-item>
      </a-form>

      <div class="w-[180px] flex justify-end">
        <a-button type="primary" @click="handleSearch">
          搜索
        </a-button>
        <a-button class="ml-4" @click="handleInit">
          重置
        </a-button>
      </div>
    </div>

    <a-table
      :data-source="data"
      :columns="columns"
      :pagination="{
        current: pagination.page,
        pageSize: pagination.size,
        total,
        onChange: onPageChange,
      }"
    >
      <template #emptyText>
        <span>暂无数据</span>
      </template>
    </a-table>
  </div>
</template>
