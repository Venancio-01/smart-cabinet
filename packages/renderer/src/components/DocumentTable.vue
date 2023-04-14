<template>
      <a-table
      :dataSource="data"
      :columns="columns"
      :pagination="{
        current: condition.page,
        pageSize: condition.size,
        total: total,
        onChange: onPageChange
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'loan_status'">
          <span v-if="record['loan_status'] === 0" class="text-green-500">在位</span>
          <span v-else-if="record['loan_status'] === 1 && !judgeIsMisPlace(record)" class="text-yellow-500">借出</span>
          <template v-else-if="record['loan_status'] === 1 && judgeIsMisPlace(record)">
            <span class="text-red-500">错放</span>
          </template>
        </template>
      </template>
      <template v-slot:emptyText>
        <span>暂无数据</span>
      </template>
    </a-table>
</template>

<script lang="ts" setup>
import { doc_document } from '@prisma/client';
import { useStore } from '@/store'
import { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs';

interface Props {
  data: doc_document[]
  total: number
  condition: {
    page: number
    size: number
  }
}

defineProps<Props>()
const emits = defineEmits(['onPageChange'])
const store = useStore()
const { userList,departmentList,cabinetDoorList,misPlaceDocumentData} = storeToRefs(store)

const columns: ColumnsType = [
  {
    title: '载体名称',
    dataIndex: 'doc_name',
    key: 'doc_name'
  },
  {
    title: '所属柜门',
    dataIndex: 'view_name',
    key: 'view_name',
    customRender: ({ record }) => {
      return cabinetDoorList.value.find(item => item.id === record.cabinet_door_id)?.view_name
    }
  },
  {
    title: '所在柜门',
    dataIndex: 'view_name',
    key: 'view_name',
    customRender: ({ record }) => {
      return judgeIsMisPlace(record) && record.misPlaceDoorName
    }
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
    customRender: ({ record }) => {
      return departmentList.value.find(item => item.id === record.binding_dept_id)?.dept_name
    }
  },
  {
    title: '状态',
    dataIndex: 'loan_status',
    key: 'loan_status'
  },
  {
    title: '最后操作用户',
    dataIndex: 'operation_user_id',
    key: 'operation_user_id',
    customRender: ({ record }) => {
      return userList.value.find(item => item.id === record.operation_user_id)?.user_name
    }
  },
  {
    title: '最后操作时间',
    dataIndex: 'doc_last_time',
    key: 'doc_last_time',
    customRender: ({ record }) => {
      return dayjs(record.doc_last_time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]

const judgeIsMisPlace = (doc: doc_document) => {
  const misPlace = misPlaceDocumentData.value.find(item => item.operation_id === doc.doc_rfid)
  return misPlace
}

const onPageChange = (page:number) =>{
  emits('onPageChange',page)
}

</script>
