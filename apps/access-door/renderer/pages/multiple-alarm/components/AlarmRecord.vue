<script lang="ts" setup>
import type { DoorAlarmrecord } from '@smart-cabinet/database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'

interface Props {
  data: DoorAlarmrecord[]
}

withDefaults(defineProps<Props>(), {
  data: () => [],
})

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
</script>

<template>
  <div class="mt-24px h-300px">
    <a-table :data-source="data" :columns="columns" :scroll="{ x: '100%', y: 300 }" :pagination="undefined" @resize-column="handleResizeColumn">
      <template #emptyText>
        <span>暂无数据</span>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
::v-deep(.ant-tabs-tab) {
  @apply text-large;
}
</style>
/template>
