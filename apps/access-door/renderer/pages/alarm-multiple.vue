<script lang="ts" setup>
import type { DoorAlarmrecord } from 'database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
const { setAlarmEquipmentList } = store
const { alarmEquipmentList } = storeToRefs(store)

const activeKey = ref(0)

const columns = ref<ColumnsType<DoorAlarmrecord>>([
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
      return dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
])
function handleResizeColumn(width: any, column: any) {
  column.width = width
}

function goHome() {
  setAlarmEquipmentList([])
  router.replace('/')
}
</script>

<template>
  <div>
    <div class="flex h-[50px] items-center justify-between">
      <BackButton :on-back="goHome" />

      <StopAlarmButton />
    </div>

    <a-tabs v-model:activeKey="activeKey" size="middle" class="!mt-12px">
      <a-tab-pane v-for="(item, index) in alarmEquipmentList" :key="index" :tab="item.equipmentName">
        <div class="mt-24px">
          <a-table :data-source="item.alarmRecordList" :columns="columns" :pagination="undefined" @resize-column="handleResizeColumn">
            <template #emptyText>
              <span>暂无数据</span>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped>
::v-deep(.ant-tabs-tab) {
  @apply text-large;
}
</style>
