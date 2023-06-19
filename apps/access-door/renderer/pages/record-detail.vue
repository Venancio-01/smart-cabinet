<script lang="ts" setup>
import type { DoorAlarmrecord } from 'database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { fetchReadRecords } from '@/features/door'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { departmentList } = storeToRefs(store)
const route = useRoute()
const accessId = computed(() => route.params.id as string)
const isFromAlarm = computed(() => route.params.fromAlarmPage === '1')

const data = ref<DoorAlarmrecord[]>([])
const total = ref(0)
const condition = reactive<Partial<ReadRecordQueryProps>>({
  page: 1,
  size: 6,
  accessId: accessId.value,
  carrierName: '',
  departmentId: undefined,
})
async function onPageChange(page: number) {
  condition.page = page

  loadReadRecords()
}

async function handleQuery() {
  condition.page = 1

  loadReadRecords()
}

async function handleInit() {
  condition.page = 1
  condition.carrierName = ''
  condition.departmentId = undefined
  data.value = []

  loadReadRecords()
}

async function loadReadRecords() {
  const { data: _data, total: _total } = await fetchReadRecords(toRaw(condition))
  data.value = _data
  total.value = _total
}

const columns = ref<ColumnsType>([
  {
    title: '载体名称',
    dataIndex: 'carrierName',
    key: 'carrierName',
  },
  {
    title: '所属部门',
    dataIndex: 'carrier_deptname',
    key: 'carrier_deptname',
  },
  {
    title: '检测时间',
    dataIndex: 'createTime',
    key: 'createTime',
    customRender({ record }) {
      return dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: '是否告警',
    dataIndex: 'is_alarm',
    key: 'is_alarm',
    customRender({ record }) {
      return record.is_alarm === '1' ? '是' : '否'
    },
  },
])

function handleResizeColumn(width, column) {
  column.width = width
}

function handleBack() {
  if (isFromAlarm.value)
    router.replace('/index')

  else
    router.back()
}

onMounted(() => {
  handleInit()
})
</script>

<template>
  <div class="w-h-full">
    <div class="flex items-center">
      <BackButton @back="handleBack" />
      <span class="text-light text-[28px] ml-6"> 出入记录详情 </span>
    </div>

    <div class="flex" m="y-8">
      <a-form
        :model="condition" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label-align="left"
        class="flex-1 grid grid-rows-1 grid-cols-2 gap-x-6" autocomplete="off"
      >
        <a-form-item label="所属部门" name="title">
          <a-select v-model:value="condition.departmentId" allow-clear placeholder="请选择部门" @change="handleQuery">
            <a-select-option v-for="item in departmentList" :key="item.deptId" :value="String(item.deptId)">
              {{ item.deptName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <div class="w-[180px] flex justify-end">
        <a-button class="ml-4" @click="handleInit">
          重置
        </a-button>
      </div>
    </div>

    <div class="mt-4">
      <a-table
        :data-source="data" :columns="columns" :pagination="{
          current: condition.page,
          pageSize: condition.size,
          total,
          onChange: onPageChange,
        }" @resizeColumn="handleResizeColumn"
      >
        <template #emptyText>
          <span>暂无数据</span>
        </template>
      </a-table>
    </div>
  </div>
</template>
