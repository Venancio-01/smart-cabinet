<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { SysUser } from '@prisma/client'
import { useStore } from '@/store'
import useSys from '@/hooks/useSys'
import useTime from '@/hooks/useTime'

const store = useStore()
const { roleList, departmentList, userRoleList, currentCabinetDoorId } = storeToRefs(store)
const { getUsersByCondition } = useSys()
const { resetOperationTimeoutCountdown } = useTime()

const condition = reactive<UserQueryProps>({
  page: 1,
  size: 7,
  userName: '',
  roleId: undefined,
  departmentId: undefined,
})

const data = ref<SysUser[]>([])
const total = ref(0)
const columns: ColumnsType = [
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
      return departmentList.value.find(item => item.deptId === record.deptId)?.deptName
    },
  },
  {
    title: '用户角色',
    dataIndex: 'roleId',
    key: 'roleId',
    customRender: ({ record }) => {
      const roleId = userRoleList.value.find(userRole => userRole.userId === record.userId)?.roleId
      if (!roleId)
        return ''

      return roleList.value.find(role => role.roleId === roleId)?.roleName
    },
  },
]

async function onPageChange(page: number) {
  condition.page = page

  getUserList()
}

async function handleSearch() {
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
  resetOperationTimeoutCountdown()
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
        :model="condition" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label-align="left"
        class="flex-1 grid grid-rows-2 grid-cols-2 gap-x-6" autocomplete="off"
      >
        <a-form-item label="用户名称">
          <a-input v-model:value="condition.userName" />
        </a-form-item>

        <a-form-item v-show="currentCabinetDoorId === 0" label="所属机构">
          <a-select v-model:value="condition.departmentId" allow-clear @change="handleSearch">
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
      :data-source="data" :columns="columns" :pagination="{
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
