<script lang="ts" setup>
import type { DoorRfidrecord } from '@smart-cabinet/database'
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { useStore } from '@/store'

interface Props {
  equipment: ActiveEquipmentProps
}

const props = defineProps<Props>()

const store = useStore()
const { departmentList } = storeToRefs(store)

const total = ref(0)
const condition = reactive<Partial<ReadRecordQueryProps>>({
  deptId: undefined,
})

const pagination = reactive<PaginationType>({
  page: 1,
  size: 6,
})

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

function handleResizeColumn(width: any, column: any) {
  column.width = width
}

function handleInit() {
  pagination.page = 1
  condition.deptId = undefined
}

function onPageChange(page: number) {
  pagination.page = page
}

const pagedData = computed(() => {
  if (condition.deptId) {
    return props.equipment.readRecordList.filter(item => String(item.carrierDeptid) === condition.deptId).slice((pagination.page - 1) * pagination.size, pagination.size * pagination.page)
  }
  else {
    return props.equipment.readRecordList.slice((pagination.page - 1) * pagination.size, pagination.size * pagination.page)
  }
})
</script>

<template>
  <div class="w-h-full">
    <div class="flex" m="y-8">
      <a-form
        :model="condition"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
        class="flex-1 grid grid-rows-1 grid-cols-2 gap-x-6"
        autocomplete="off"
      >
        <a-form-item label="所属部门" name="title">
          <a-select v-model:value="condition.deptId" allow-clear placeholder="请选择部门" >
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
        :data-source="pagedData"
        :columns="columns"
        :pagination="{
          current: pagination.page,
          pageSize: pagination.size,
          total,
          onChange: onPageChange,
        }"
        @resize-column="handleResizeColumn"
      >
        <template #emptyText>
          <span>暂无数据</span>
        </template>
      </a-table>
    </div>
  </div>
</template>
