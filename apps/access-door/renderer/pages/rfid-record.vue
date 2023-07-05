<script lang="ts" setup>
import type { DoorRfidrecord, DoorRfidrecordProps } from 'database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import useDoor from '@/hooks/useDoor'
import { AccessDirection, AccessTimeRange } from '~/enums'

const router = useRouter()
const { selectRfidRecordList } = useDoor()

const data = ref<DoorRfidrecordProps[]>([])
const total = ref(0)
const condition = reactive<ReadRecordQueryProps>({
  carrierName: '',
  type: undefined,
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
  condition.type = undefined
  condition.timeRange = undefined
  data.value = []

  getRfidRecordList()
}

async function getRfidRecordList() {
  const { data: _data, total: _total } = await selectRfidRecordList(toRaw(pagination), toRaw(condition))
  console.log('🚀 ~ file: record.vue:55 ~ getRfidRecordList ~ _data:', _data)
  data.value = _data
  total.value = _total
}

const columns = ref<ColumnsType<DoorRfidrecord>>([
  {
    title: '载体名称',
    dataIndex: 'carrierName',
    key: 'carrierName',
    align: 'center',
    width: 200,
  },
  {
    title: '出入方向',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    customRender({ record }) {
      return Number(record.type) === AccessDirection.IN ? '进入' : '外出'
    },
    width: 120,
  },
  {
    title: '出入时间',
    dataIndex: 'directionCreateTime',
    key: 'directionCreateTime',
    align: 'center',
    customRender({ record }) {
      return dayjs(record.creatorTime).format('YYYY-MM-DD HH:mm:ss')
    },
    width: 200,
  },
])

function handleResizeColumn(width, column) {
  column.width = width
}

onMounted(() => {
  handleInit()
})
</script>

<template>
  <div class="w-h-full">
    <div class="flex items-center">
      <BackButton />
      <span class="text-light text-[28px] ml-6"> 出入记录 </span>
    </div>

    <div class="flex" m="t-8" p="b-4">
      <a-form
        :model="condition"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
        class="flex-1 grid grid-rows-2 grid-cols-2 gap-x-6"
        autocomplete="off">
        <a-form-item label="载体名称" name="title">
          <a-input v-model:value="condition.carrierName" placeholder="请输入载体名称"></a-input>
        </a-form-item>

        <a-form-item label="出入方向" name="title">
          <a-select v-model:value="condition.type" allow-clear placeholder="请选择出入方向" @change="handleQuery">
            <a-select-option :value="AccessDirection.ALL"> 全部 </a-select-option>
            <a-select-option :value="AccessDirection.IN"> 进入 </a-select-option>
            <a-select-option :value="AccessDirection.OUT"> 外出 </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="出入时间" name="title">
          <a-select v-model:value="condition.timeRange" allow-clear placeholder="请选择出入时间" @change="handleQuery">
            <a-select-option v-for="item in AccessTimeRangeMap" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <div class="w-[180px] flex justify-end">
        <a-button type="primary" @click="handleQuery"> 搜索 </a-button>
        <a-button class="ml-4" @click="handleInit"> 重置 </a-button>
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
        @resize-column="handleResizeColumn">
        <template #emptyText>
          <span>暂无数据</span>
        </template>
      </a-table>
    </div>
  </div>
</template>
