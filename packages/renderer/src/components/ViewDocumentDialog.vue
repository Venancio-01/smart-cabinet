<template>
  <BaseDialog v-model:visible="show" title="查看文件" :width="700" :height="600" @close="onClose">
    <a-form
      :model="condition"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      class="gird-rows-2 grid grid-cols-[1fr_1fr_200px] gap-y-2 py-4"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item label="文件名" name="title">
        <a-input v-model:value="condition.title" />
      </a-form-item>

      <a-form-item label="状态" name="title">
        <a-select ref="select" v-model:value="condition.state" allowClear>
          <a-select-option :value="0">在位</a-select-option>
          <a-select-option :value="1">借出</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item class="row-span-2" :wrapper-col="{ span: 24 }">
        <div class="flex h-full w-full items-center justify-center">
          <a-button html-type="submit" type="primary">搜索</a-button>
          <a-button @click="handleReset" class="ml-4">重置</a-button>
        </div>
      </a-form-item>

      <a-form-item v-show="currentCabinetDoorId === 0" label="柜门" name="title">
        <a-select ref="select" v-model:value="condition.cabinetId" allowClear>
          <a-select-option v-for="item in cabinetDoorList" :key="item.id" :value="item.id">{{ item.view_name }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-show="currentCabinetDoorId === 0" label="部门" name="title">
        <a-select ref="select" v-model:value="condition.departmentId" allowClear>
          <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{ item.dept_name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <a-table
      :dataSource="data"
      :columns="columns"
      :pagination="{
        current: condition.page,
        pageSize: condition.size,
        total: total,
        onChange: onPageChange
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'doc_reissue_number'">
          <span v-if="record['doc_reissue_number'] === 0" class="text-green-500">在位</span>
          <span v-if="record['doc_reissue_number'] === 1" class="text-yellow-500">借出</span>
        </template>
      </template>
      <template v-slot:emptyText>
        <span>暂无数据</span>
      </template>
    </a-table>
  </BaseDialog>
</template>

<script lang="ts" setup>
import useDocument from '@/hooks/useDocument'
import { useStore } from '@/store'
import { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'

const store = useStore()
const { resetOperationTimeout, changeViewDocumentVisible } = store
const { cabinetDoorList, viewDocumentVisible, departmentList, currentCabinetDoorId } = storeToRefs(store)
const { getDocumentData } = useDocument()

const show = computed({
  get: () => {
    return viewDocumentVisible.value
  },
  set: value => {
    changeViewDocumentVisible(value)
  }
})

const data = ref([])
const total = ref(0)
const condition = reactive({
  page: 1,
  size: 5,
  title: '',
  cabinetId: '',
  departmentId: '',
  state: ''
})

const onPageChange = async (page: number) => {
  condition.page = page

  searchDocumentData()
}

const searchDocumentData = async () => {
  const result = await getDocumentData(condition)
  data.value = result.data
  total.value = result.total
}

const onFinish = async () => {
  condition.page = 1

  searchDocumentData()
}

const handleReset = () => {
  condition.page = 1
  condition.title = ''
  condition.cabinetId = currentCabinetDoorId.value ? String(currentCabinetDoorId.value) : ''
  condition.departmentId = ''
  condition.state = ''
  data.value = []

  searchDocumentData()
}

watch(show, async value => {
  if (!value) return

  condition.cabinetId = currentCabinetDoorId.value ? String(currentCabinetDoorId.value) : ''

  searchDocumentData()
  resetOperationTimeout()
})

const columns: ColumnsType = [
  {
    title: '文件名',
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
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
    customRender: ({ record }) => {
      return departmentList.value.find(item => item.id === record.binding_dept_id)?.dept_name
    }
  },
  {
    title: '状态',
    dataIndex: 'doc_reissue_number',
    key: 'doc_reissue_number'
  },
  {
    title: '最后操作时间',
    dataIndex: 'doc_last_time',
    key: 'doc_last_time',
    customRender: ({ record }) => {
      return dayjs(record.doc_last_time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]

const onClose = () => {
  handleReset()
  resetOperationTimeout()
}
</script>

<style scoped>
.form-item {
  @apply flex items-center text-white;
}
.form-item .label {
  @apply h-[30px] w-[120px] text-justify  text-sm leading-[30px];
}
.form-item .label::after {
  content: '';
  display: inline-block;
  padding-left: 100%;
  margin-left: 100%;
}

.form-item input {
  @apply h-[30px] w-full text-black;
}
.form-item input[type='password'] {
  @apply text-2xl;
}
.form-item + .form-item {
  @apply mt-[16px];
}
.ant-form-item {
  @apply mb-0;
}
</style>
