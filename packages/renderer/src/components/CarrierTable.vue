<template>
  <a-table
    :data-source="selfData"
    :columns="columns"
    :pagination="{
      current: condition.page,
      pageSize: condition.size,
      total: total,
      onChange: onPageChange
    }"
    @resizeColumn="handleResizeColumn"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'loan_status'">
        <span v-if="record['loan_status'] === 0" class="text-green-500">在位</span>
        <span v-else-if="record['loan_status'] === 1 && !judgeIsMisPlace(record)" class="text-warning">借出</span>
        <template v-else-if="record['loan_status'] === 1 && judgeIsMisPlace(record)">
          <span class="text-error">错放</span>
        </template>
      </template>
    </template>
    <template #emptyText>
      <span>暂无数据</span>
    </template>
  </a-table>
</template>

<script lang="tsx" setup>
import { doc_document } from '@prisma/client'
import { useStore } from '@/store'
import usePermission from '@/hooks/usePermission'
import { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import useCarrier from '@/hooks/useCarrier'
import useMessage from '@/hooks/useMessage'
import useTime from '@/hooks/useTime'

type Props = {
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
  operable: false
})
const emits = defineEmits(['onPageChange', 'onDataChange'])
const store = useStore()
const { userList, departmentList, cabinetDoorList, misPlaceCarrierData } = storeToRefs(store)
const { hasPermission } = usePermission()
const { updateCarrier } = useCarrier()
const { createMessage } = useMessage()
const { resetOperationTimeoutCountdown } = useTime()

const selfData = ref<CustomCarrierType[]>([])

watch(
  () => props.data,
  () => {
    selfData.value = props.data.map(item => ({ ...item, visible: false }))
  }
)
const columns = ref<ColumnsType>([
  {
    title: '工具名称',
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
    width: '80px',
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
    width: '170px',
    customRender: ({ record }) => {
      return dayjs(record.doc_last_time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
])

const judgeIsMisPlace = (doc: doc_document) => {
  const misPlace = misPlaceCarrierData.value.find(item => item.operation_id === doc.doc_rfid)
  return misPlace
}

const onPageChange = (page: number) => {
  emits('onPageChange', page)
}

const handleResizeColumn = (width, column) => {
  column.width = width
}

// 出库
const handleOutbound = async (carrier: CustomCarrierType) => {
  await updateCarrier(carrier.doc_id, {
    stock_status: 0,
    doc_last_time: new Date()
  })
  carrier.visible = false
  getInboundCarrierData()
  emits('onDataChange')
  createMessage.success({
    content: '出库成功'
  })
  resetOperationTimeoutCountdown()
}

const hide = (selfData: CustomCarrierType) => {
  selfData.visible = false
  resetOperationTimeoutCountdown()
}

onMounted(() => {
  columns.value = columns.value.map(item => ({
    ...item,
    align: 'center',
    ellipsis: true
  }))
  // const hasOperationColumn = props.operable && (hasPermission('remove_carrier') || hasPermission('mange_carrier'))
  // if (hasOperationColumn) {
  //   columns.value.push({
  //     width: '100px',
  //     title: '操作',
  //     align: 'center',
  //     dataIndex: 'operation',
  //     key: 'operation',
  //     customRender: ({ record }) => {
  //       return (
  //         <span>
  //           {hasPermission('remove_carrier') ? (
  //             <a-popover
  //               v-model={[record.visible, 'visible']}
  //               title="提示"
  //               trigger="click"
  //               content={
  //                 <>
  //                   <p class="w-[200px]">出库后工具将从管理软件中移除，确定将工具出库吗？</p>
  //                   <div class="flex justify-end">
  //                     <a-button type="link" class="mr-2" onClick={() => handleOutbound(record)}>
  //                       确定
  //                     </a-button>
  //                     <a-button type="text" onClick={() => hide(record)}>
  //                       取消
  //                     </a-button>
  //                   </div>
  //                 </>
  //               }
  //             >
  //               <a-button type="link" class="mr-2">
  //                 出库
  //               </a-button>
  //             </a-popover>
  //           ) : null}
  //           {/* {hasPermission('manage_carrier') ? <a-button type="link">编辑</a-button> : null} */}
  //         </span>
  //       )
  //     }
  //   })
  // }
})
</script>

<style scoped>
:deep(.ant-btn-link),
:deep(.ant-btn-text) {
  @apply p-0;
}
</style>
