<script lang="ts" setup>
import type { DoorRfidrecord } from 'database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { setCurrentReadRecordList } = store
const { currentReadRecordList, departmentList } = storeToRefs(store)

const data = ref<DoorRfidrecord[]>([])
const total = ref(0)
const condition = reactive<Partial<ReadRecordQueryProps>>({
  carrierName: '',
  deptId: undefined,
})
const pagination = reactive<PaginationType>({
  page: 1,
  size: 6,
})

const activeKey = ref('1')

const columns = ref<ColumnsType<DoorRfidrecord>>([
  {
    title: '载体名称',
    dataIndex: 'carrierName',
    key: 'carrierName',
  },
  {
    title: '所属部门',
    dataIndex: 'carrierDeptName',
    key: 'carrierDeptName',
  },
  {
    title: '检测时间',
    dataIndex: 'createTime',
    key: 'createTime',
    customRender({ record }) {
      return dayjs(record.creatorTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
])
function handleResizeColumn(width, column) {
  column.width = width
}

function handleBack() {
  router.replace('/')
  setCurrentReadRecordList([])
}

function handleQuery() {}

function handleInit() {
  pagination.page = 1
  condition.carrierName = ''
  condition.timeRange = undefined

  generateData()
}

function onPageChange(page: number) {
  pagination.page = page

  generateData()
}

function generateData() {
  data.value = currentReadRecordList.value.splice((pagination.page - 1) * pagination.size, pagination.size * pagination.page)
}

onMounted(() => {
  generateData()
})

function goHome() {
  setCurrentReadRecordList([])
  router.replace('/')
}
</script>

<template>
  <div>
    <div class="flex h-[50px] items-center justify-between">
      <BackButton :on-back="goHome" />

      <StopAlarmButton />
    </div>

    <a-tabs v-model:activeKey="activeKey" size="middle">
      <a-tab-pane key="1" tab="大门">
        <div class="mt-4">
          <a-table
            :data-source="data"
            :columns="columns"
            :pagination="{
              current: pagination.page,
              pageSize: pagination.size,
              total,
              onChange: onPageChange,
            }"
            @resize-column="handleResizeColumn">
            <template #emptyText>
              <span>暂无数据</span>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
