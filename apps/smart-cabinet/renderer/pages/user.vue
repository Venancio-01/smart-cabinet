<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue'
import type { Prisma, SysUser, SysUserProps } from '@smart-cabinet/database'
import { useStore } from '@/store'

const store = useStore()
const { roleList, departmentList, currentCabinetDoorId } = storeToRefs(store)

const condition = reactive<UserQueryProps>({
  userName: '',
  roleId: undefined,
  deptId: undefined,
})
const pagination = reactive<PaginationType>({
  page: 1,
  size: 5,
})

const data = ref<SysUser[]>([])
const total = ref(0)
const columns: TableColumnsType<SysUserProps> = [
  {
    title: '用户名称',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '所属机构',
    dataIndex: 'deptId',
    key: 'deptId',
    customRender: ({ record }) => {
      return record?.department?.deptName
    },
  },
  {
    title: '用户角色',
    dataIndex: 'roleId',
    key: 'roleId',
    customRender: ({ record }) => {
      return record?.userRole?.[0]?.role?.roleName
    },
  },
]

async function onPageChange(page: number) {
  pagination.page = page

  getUserList()
}

async function handleSearch() {
  pagination.page = 1

  getUserList()
}

function handleInit() {
  pagination.page = 1
  condition.userName = ''
  condition.deptId = undefined
  condition.roleId = undefined
  data.value = []

  getUserList()
}

async function getUserList() {
  const query: Prisma.SysUserWhereInput = {
    userName: condition.userName ? { contains: condition.userName } : undefined,
    deptId: condition.deptId,
    userRole: {
      some: {
        roleId: condition.roleId,
      },
    },
  }

  const { data: _data, total: _total } = await window.electronApi.ipcRenderer.invoke('sys:select-sys-user-list-with-page', toRaw(pagination), query)
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
        <a-form-item label="用户名称">
          <a-input v-model:value="condition.userName" />
        </a-form-item>

        <a-form-item v-show="currentCabinetDoorId === 0" label="所属机构">
          <a-select v-model:value="condition.deptId" allow-clear @change="handleSearch">
            <a-select-option v-for="item in departmentList" :key="item.deptId" :value="item.deptId">
              {{ item.deptName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="用户角色">
          <a-select v-model:value="condition.roleId" allow-clear @change="handleSearch">
            <a-select-option v-for="item in roleList" :key="item.roleId" :value="item.roleId">
              {{ item.roleName }}
            </a-select-option>
          </a-select>
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
