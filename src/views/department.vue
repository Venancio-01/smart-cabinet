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
        <a-form-item label="部门名称">
          <a-input v-model:value="condition.departmentName" />
        </a-form-item>
      </a-form>

      <div class="w-[180px] flex justify-end">
        <a-button type="primary" @click="handleSubmit">搜索</a-button>
        <a-button class="ml-4" @click="handleInit">重置</a-button>
      </div>
    </div>

    <a-table
      :data-source="data"
      :columns="columns"
      :pagination="{
        current: condition.page,
        pageSize: condition.size,
        total: total,
        onChange: onPageChange
      }"
    >
      <template #emptyText>
        <span>暂无数据</span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import useSys from '@/hooks/useSys'
import { ColumnsType } from 'ant-design-vue/es/table'
import { sys_dept } from '.prisma/client'

const { getDepartmentsByCondition } = useSys()

const condition = reactive<DepartmentQueryProps>({
  page: 1,
  size: 8,
  departmentName: ''
})

const data = ref<sys_dept[]>([])
const total = ref(0)
const columns: ColumnsType = [
  {
    title: '部门名称',
    dataIndex: 'dept_name',
    key: 'dept_name'
  }
]

const onPageChange = async (page: number) => {
  condition.page = page

  getUserList()
}

const handleSubmit = async () => {
  condition.page = 1

  getUserList()
}

const handleInit = () => {
  condition.page = 1
  condition.departmentName = ''
  data.value = []

  getUserList()
}

const getUserList = async () => {
  data.value = await getDepartmentsByCondition(condition)
}

onMounted(() => {
  handleInit()
})
</script>
