<script lang="tsx" setup>
import type { DocDocument, DocDocumentProps } from 'database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { AlarmContentType, BorrowedState, OperationStatus } from '~/enums'
import { useStore } from '@/store'

interface Props {
  operable: boolean
  data: DocDocumentProps[]
  total: number
  condition: {
    page: number
    size: number
  }
}


const props = withDefaults(defineProps<Props>(), {
  data: () =>[],
  operable: false,
})
const emits = defineEmits(['onPageChange', 'onDataChange'])
const store = useStore()
const { userList } = storeToRefs(store)


const dataWithMisPlace = computed(()=>{
  return props.data.map(carrier => {
    const hasUnoperatedMisPlaceRecord = carrier.alarmRecord.some(item => Number(item.contentType) === AlarmContentType.IncorrectLocation &&  Number(item.isOperation) === OperationStatus.Unoperated)
    return {
      ...carrier,
      isMisPlace: hasUnoperatedMisPlaceRecord
    }
  })
})

const columns = ref<ColumnsType<DocDocumentProps>>([
  {
    title: '载体名称',
    dataIndex: 'docName',
    key: 'docName',
  },
  {
    title: '所在柜门',
    dataIndex: 'viewName',
    key: 'viewName',
    customRender: ({ record }) => {
      // return judgeIsMisPlace(record) && record.misPlaceDoorName
    },
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
    customRender: ({ record }) => {
      return record?.department.deptName
    },
  },
  {
    title: '状态',
    width: '80px',
    dataIndex: 'docPStatus',
    key: 'docPStatus',
  },
  {
    title: '最后操作用户',
    dataIndex: 'docLastUserId',
    key: 'docLastUserId',
    customRender: ({ record }) => {
      return userList.value.find((item) => Number(item.userId) === record.docLastUserId)?.userName
    },
  },
  {
    title: '最后操作时间',
    dataIndex: 'docLastTime',
    key: 'docLastTime',
    width: '170px',
    customRender: ({ record }) => {
      return record.docLastTime && dayjs(record.docLastTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
])

/**
 * @description: 判断载体是否错放
 * @param {*} carrier
 * @return {*}
 */
function judgeIsMisPlace(carrier: DocDocumentProps) {
  if(carrier.alarmRecord.length === 0) return false

  const hasUnoperatedMisPlaceRecord = carrier.alarmRecord.some(item => Number(item.contentType) === AlarmContentType.IncorrectLocation &&  Number(item.isOperation) === OperationStatus.Unoperated)
  return hasUnoperatedMisPlaceRecord
}

function onPageChange(page: number) {
  emits('onPageChange', page)
}

function handleResizeColumn(width, column) {
  column.width = width
}

onMounted(() => {
  columns.value = columns.value.map((item) => ({
    ...item,
    align: 'center',
    ellipsis: true,
  }))
})
</script>

<template>
  <a-table
    :data-source="dataWithMisPlace"
    :columns="columns"
    :pagination="{
      current: condition.page,
      pageSize: condition.size,
      total,
      onChange: onPageChange,
    }"
    @resize-column="handleResizeColumn">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'docPStatus'">
          <span v-if="!record.isMisPlace && record.docPStatus === BorrowedState.Returned" class="text-green-500">在柜</span>
          <span v-else-if="!record.isMisPlace && record.docPStatus === BorrowedState.Borrowed" class="text-warning">领用</span>
          <span v-else-if="record.isMisPlace" class="text-error">错放</span>
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
