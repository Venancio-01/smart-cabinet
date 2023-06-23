<script lang="ts" setup>
import type { DoorAccessRecords } from 'database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import useDoor from '@/hooks/useDoor'
import { AccessTimeRange, AccessWithCarrier, IsViewed } from '~/enums'

const router = useRouter()
const { fetchAccessRecords, updateAccessRecord } = useDoor()

const data = ref<DoorAccessRecords[]>([])
const total = ref(0)
const condition = reactive<Partial<AccessRecordQueryProps>>({
  page: 1,
  size: 5,
  accessDirection: undefined,
  hasAlarm: undefined,
  timeRange: undefined,
  withCarrier: undefined,
})

const AccessTimeRangeMap = [
  { label: '全部', value: AccessTimeRange.ALL },
  { label: '今天', value: AccessTimeRange.TODAY },
  { label: '本周', value: AccessTimeRange.WEEK },
  { label: '本月', value: AccessTimeRange.MONTH },
]

async function onPageChange(page: number) {
  condition.page = page
  loadAccessRecords()
}

async function handleQuery() {
  condition.page = 1

  loadAccessRecords()
}

async function handleInit() {
  condition.page = 1
  condition.accessDirection = undefined
  condition.hasAlarm = undefined
  condition.timeRange = undefined
  condition.withCarrier = undefined
  data.value = []

  loadAccessRecords()
}

async function loadAccessRecords() {
  const { data: _data, total: _total } = await fetchAccessRecords(toRaw(condition))
  data.value = _data
  total.value = _total
}

const columns = ref<ColumnsType>([
  {
    title: '出入方向',
    dataIndex: 'accessDirection',
    key: 'accessDirection',
    align: 'center',
    width: 120,
  },
  {
    title: '出入时间',
    dataIndex: 'directionCreateTime',
    key: 'directionCreateTime',
    align: 'center',
    customRender({ record }) {
      return dayjs(record.directionCreateTime).format('YYYY-MM-DD HH:mm:ss')
    },
    width: 200,
  },
  {
    title: '是否告警',
    dataIndex: 'has_alarm',
    key: 'has_alarm',
    align: 'center',
    width: 120,
  },
  {
    title: '携带载体数量',
    dataIndex: 'carrier_count',
    key: 'carrier_count',
    align: 'center',
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

function handleResizeColumn(width, column) {
  column.width = width
}

function goDetail(record: DoorAccessRecords) {
  if (record.is_viewed === IsViewed.UNVIEWED) {
    updateAccessRecord(record.accessId, {
      ...record,
      is_viewed: IsViewed.VIEWED,
    })
  }
  router.push(`/record-detail/${record.accessId}/0`)
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
        <a-form-item label="出入方向" name="title">
          <a-select v-model:value="condition.accessDirection" allow-clear placeholder="请选择出入方向" @change="handleQuery">
            <a-select-option :value="0"> 全部 </a-select-option>
            <a-select-option :value="1"> 进入 </a-select-option>
            <a-select-option :value="2"> 外出 </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="出入时间" name="title">
          <a-select v-model:value="condition.timeRange" allow-clear placeholder="请选择出入时间" @change="handleQuery">
            <a-select-option v-for="item in AccessTimeRangeMap" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="是否告警" name="title">
          <a-select v-model:value="condition.hasAlarm" allow-clear placeholder="请选择是否告警" @change="handleQuery">
            <a-select-option :value="1"> 是 </a-select-option>
            <a-select-option :value="0"> 否 </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="携带载体" name="title">
          <a-select v-model:value="condition.withCarrier" allow-clear placeholder="请选择是否携带载体" @change="handleQuery">
            <a-select-option :value="AccessWithCarrier.ALL"> 全部 </a-select-option>
            <a-select-option :value="AccessWithCarrier.WITH_CARRIER"> 是 </a-select-option>
            <a-select-option :value="AccessWithCarrier.WITHOUT_CARRIER"> 否 </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <div class="w-[100px] flex justify-end">
        <a-button class="ml-4" @click="handleInit"> 重置 </a-button>
      </div>
    </div>

    <div class="mt-2">
      <a-table
        :data-source="data"
        :columns="columns"
        :pagination="{
          current: condition.page,
          pageSize: condition.size,
          total,
          showSizeChanger: false,
          onChange: onPageChange,
        }"
        @resizeColumn="handleResizeColumn">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'title'">
            <span v-if="record.accessDirection === 1">检测到人员进入</span>
            <span v-else-if="record.accessDirection === 2">检测到人员外出</span>
          </template>

          <template v-if="column.dataIndex === 'accessDirection'">
            <span>{{ record.accessDirection === 1 ? '进入' : record.accessDirection === 2 ? '外出' : '' }}</span>
          </template>

          <template v-if="column.dataIndex === 'has_alarm'">
            <span>{{ record.has_alarm === 0 ? '否' : record.has_alarm === 1 ? '是' : '' }}</span>
          </template>

          <template v-if="column.dataIndex === 'action'">
            <a-button v-if="record.carrier_count > 0" type="link" size="small" @click="goDetail(record)"> 查看详情 </a-button>
            <div v-else w="56px" h="22px" />
          </template>
        </template>

        <template #emptyText>
          <span>暂无数据</span>
        </template>
      </a-table>
    </div>
  </div>
</template>
