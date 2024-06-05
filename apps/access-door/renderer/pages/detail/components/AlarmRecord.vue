<script lang="ts" setup>
import type { DoorAlarmrecordProps } from '@smart-cabinet/database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import { Modal } from 'ant-design-vue'
import useEquipment from '@/hooks/useEquipment'
import useListenAction from '@/hooks/useListenAction'
import { AccessTimeRange, OperationStatus } from '~/enums'
import { useStore } from '@/store'
import ipcNames from '#/ipcNames'

interface Props {
  id?: number
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
})

const store = useStore()
const { departmentList } = storeToRefs(store)
const { selectAlarmRecordList } = useEquipment()
const { operationTimeoutCountdown, startMountHook } = useListenAction()

const data = ref<DoorAlarmrecordProps[]>([])
const total = ref(0)
const condition = reactive<AlarmQueryProps>({
  carrierName: '',
  equipmentId: props.id,
  deptId: undefined,
  timeRange: undefined,
})

const pagination = reactive<PaginationType>({
  page: 1,
  size: 6,
})

const AccessTimeRangeMap = [
  { label: '全部', value: AccessTimeRange.ALL },
  { label: '今天', value: AccessTimeRange.TODAY },
  { label: '本周', value: AccessTimeRange.WEEK },
  { label: '本月', value: AccessTimeRange.MONTH },
]

async function onPageChange(page: number) {
  pagination.page = page
  getRfidRecordList()
}

async function handleQuery() {
  pagination.page = 1

  getRfidRecordList()
}

async function handleInit() {
  pagination.page = 1
  condition.carrierName = ''
  condition.equipmentId = props.id
  condition.deptId = undefined
  condition.timeRange = undefined
  data.value = []

  getRfidRecordList()
}

async function getRfidRecordList() {
  const { data: _data, total: _total } = await selectAlarmRecordList(toRaw(pagination), toRaw(condition))
  data.value = _data
  total.value = _total
}

const columns = ref<ColumnsType<DoorAlarmrecordProps>>([
  {
    title: '载体名称',
    dataIndex: 'carrierName',
    key: 'carrierName',
    align: 'center',
    width: 200,
  },
  {
    title: '所属部门',
    dataIndex: 'carrierDeptId',
    key: 'carrierDeptId',
    align: 'center',
    customRender({ record }) {
      return record?.department?.deptName
    },
    width: 200,
  },
  {
    title: '报警时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    customRender({ record }) {
      return dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
    width: 200,
  },
  {
    title: '确认状态',
    dataIndex: 'operationStatus',
    key: 'operationStatus',
    align: 'center',
    customRender({ record }) {
      return Number(record.isOperation) === OperationStatus.UNPROCESSED ? '未处理' : '已处理'
    },
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: 120,
  },
])

function handleResizeColumn(width: any, column: any) {
  column.width = width
}

async function handleConfirm(record: DoorAlarmrecordProps) {
  const condition = {
    alarmid: record.alarmid,
  }
  const data = {
    isOperation: `${OperationStatus.PROCESSED}`,
  }

  await rendererInvoke(ipcNames.accessDoor.updateDoorAlarmRecord, { condition, data })
  getRfidRecordList()
}

async function handleConfirmAll() {
  Modal.confirm({
    title: '确认全部确认',
    content: '确认全部确认后，所有未处理的报警记录将会被标记为已处理，是否确认全部确认？',
    centered: true,
    onOk: async () => {
      const condition = {
        isOperation: `${OperationStatus.UNPROCESSED}`,
      }
      const data = {
        isOperation: `${OperationStatus.PROCESSED}`,
      }

      await rendererInvoke(ipcNames.accessDoor.updateManyDoorAlarmRecord, { condition, data })
      getRfidRecordList()
    },
  })
}

onMounted(() => {
  handleInit()
})

startMountHook()
</script>

<template>
  <div class="w-h-full">
    <div class="flex" m="t-4" p="b-2">
      <a-form
        :model="condition"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
        class="flex-1 grid grid-rows-2 grid-cols-2 gap-x-6"
        autocomplete="off"
      >
        <a-form-item label="载体名称" name="title">
          <a-input v-model:value="condition.carrierName" placeholder="请输入载体名称" />
        </a-form-item>

        <a-form-item label="所属部门" name="title">
          <a-select v-model:value="condition.deptId" allow-clear placeholder="请选择部门" @change="handleQuery">
            <a-select-option v-for="item in departmentList" :key="item.deptId" :value="Number(item.deptId)">
              {{ item.deptName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="报警时间" name="title">
          <a-select v-model:value="condition.timeRange" allow-clear placeholder="请选择报警时间" @change="handleQuery">
            <a-select-option v-for="item in AccessTimeRangeMap" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <div class="w-[290px]">
        <a-button class="ml-4" type="primary" @click="handleQuery">
          搜索
        </a-button>
        <a-button class="ml-4" @click="handleInit">
          重置
        </a-button>
        <a-button type="primary" class="ml-4" @click="handleConfirmAll">
          全部确认
        </a-button>
      </div>
    </div>

    <div class="mt-2">
      <a-table
        :data-source="data"
        :columns="columns"
        :pagination="{
          current: pagination.page,
          pageSize: pagination.size,
          total,
          showSizeChanger: false,
          onChange: onPageChange,
        }"
        @resize-column="handleResizeColumn"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <span
              v-if="Number(record.isOperation) === OperationStatus.UNPROCESSED"
              class="text-primary cursor-pointer"
              @click="handleConfirm(record)"
            >确认</span>
          </template>
        </template>

        <template #emptyText>
          <span>暂无数据</span>
        </template>
      </a-table>
    </div>
  </div>
</template>@/hooks/useEquipment
