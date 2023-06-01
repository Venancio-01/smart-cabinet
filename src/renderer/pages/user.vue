<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import { useStore } from '@/store'
import useSys from '@/hooks/useSys'

const store = useStore()
const { roleList, departmentList, currentCabinetDoorId } = storeToRefs(store)
const { getUsersByCondition } = useSys()

const condition = reactive<UserQueryProps>({
  page: 1,
  size: 8,
  userName: '',
  roleId: undefined,
  departmentId: undefined,
})

const data = ref<UserWithRoleProps[]>([])
const total = ref(0)
const columns: ColumnsType = [
  {
    title: '用户名称',
    dataIndex: 'user_name',
    key: 'user_name',
  },
  {
    title: '所属部门',
    dataIndex: 'dept_id',
    key: 'dept_id',
    customRender: ({ record }) => {
      return departmentList.value.find(item => item.id === record.dept_id)?.dept_name
    },
  },
  {
    title: '用户角色',
    dataIndex: 'role_id',
    key: 'role_id',
    customRender: ({ record }) => {
      return record.role?.role_name
    },
  },
]

async function onPageChange(page: number) {
  condition.page = page

  getUserList()
}

async function handleSubmit() {
  condition.page = 1

  getUserList()
}

function handleInit() {
  condition.page = 1
  condition.userName = ''
  condition.departmentId = undefined
  condition.roleId = undefined
  data.value = []

  getUserList()
}

async function getUserList() {
  data.value = await getUsersByCondition(condition)
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
        <a-form-item label="用户名称">
          <a-input v-model:value="condition.userName" />
        </a-form-item>

        <a-form-item v-show="currentCabinetDoorId === 0" label="所属部门">
          <a-select ref="select" v-model:value="condition.departmentId" allow-clear>
            <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">
              {{ item.dept_name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="用户角色">
          <a-select ref="select" v-model:value="condition.roleId" allow-clear>
            <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">
              {{ item.role_name }}
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

    <a-table
      :data-source="data"
      :columns="columns"
      :pagination="{
        current: condition.page,
        pageSize: condition.size,
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
