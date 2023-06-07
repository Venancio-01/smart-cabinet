<script lang="tsx" setup>
import type { doc_document } from '@prisma/client'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { useStore } from '@/store'

interface Props {
  operable: boolean
  data: doc_document[]
  total: number
  condition: {
    page: number
    size: number
  }
}

type CustomCarrierType = doc_document & { visible: boolean }

const props = withDefaults(defineProps<Props>(), {
  operable: false,
})
const emits = defineEmits(['onPageChange', 'onDataChange'])
const store = useStore()
const { userList, departmentList, cabinetDoorList, misPlaceCarrierData } = storeToRefs(store)

const selfData = ref<CustomCarrierType[]>([])

watch(
  () => props.data,
  () => {
    selfData.value = props.data.map(item => ({ ...item, visible: false }))
  },
)
const columns = ref<ColumnsType>([
  {
    title: '载体名称',
    dataIndex: 'doc_name',
    key: 'doc_name',
  },
  {
    title: '所属柜门',
    dataIndex: 'viewName',
    key: 'viewName',
    customRender: ({ record }) => {
      return cabinetDoorList.value.find(item => item.Id === record.CabinetDoorId)?.viewName
    },
  },
  {
    title: '所在柜门',
    dataIndex: 'viewName',
    key: 'viewName',
    customRender: ({ record }) => {
      return judgeIsMisPlace(record) && record.misPlaceDoorName
    },
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
    customRender: ({ record }) => {
      return departmentList.value.find(item => item.dept_id === record.dept_id)?.dept_name
    },
  },
  {
    title: '状态',
    width: '80px',
    dataIndex: 'loan_status',
    key: 'loan_status',
  },
  {
    title: '最后操作用户',
    dataIndex: 'operation_user_id',
    key: 'operation_user_id',
    customRender: ({ record }) => {
      return userList.value.find(item => item.user_id === record.operation_user_id)?.user_name
    },
  },
  {
    title: '最后操作时间',
    dataIndex: 'doc_last_time',
    key: 'doc_last_time',
    width: '170px',
    customRender: ({ record }) => {
      return record.doc_last_time && dayjs(record.doc_last_time).format('YYYY-MM-DD HH:mm:ss')
    },
  },
])

function judgeIsMisPlace(doc: doc_document) {
  const misPlace = misPlaceCarrierData.value.find(item => item.operationID === doc.doc_rfid)
  return misPlace
}

function onPageChange(page: number) {
  emits('onPageChange', page)
}

function handleResizeColumn(width, column) {
  column.width = width
}

onMounted(() => {
  columns.value = columns.value.map(item => ({
    ...item,
    align: 'center',
    ellipsis: true,
  }))
})
</script>

<template>
  <a-table
    :data-source="selfData"
    :columns="columns"
    :pagination="{
      current: condition.page,
      pageSize: condition.size,
      total,
      onChange: onPageChange,
    }"
    @resize-column="handleResizeColumn"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'loan_status'">
        <span v-if="record.loan_status === 0" class="text-green-500">在位</span>
        <span v-else-if="record.loan_status === 1 && !judgeIsMisPlace(record)" class="text-warning">借出</span>
        <template v-else-if="record.loan_status === 1 && judgeIsMisPlace(record)">
          <span class="text-error">错放</span>
        </template>
      </template>
    </template>
    <template #emptyText>
      <span>暂无数据</span>
    </template>
  </a-table>
</template>

<style scoped>
:deep(.ant-btn-link),
:deep(.ant-btn-text) {
  @apply p-0;
}
</style>
