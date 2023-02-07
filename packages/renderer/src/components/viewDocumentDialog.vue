<template>
  <BaseDialog v-model:visible="show" title="查看文件" :width="700" :height="550" @close="onClose">
    <a-form
      :model="condition"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      class="grid grid-cols-[1fr_1fr_1fr_160px] py-4"
      layout="inline"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item label="文件名" name="title">
        <a-input v-model:value="condition.title" />
      </a-form-item>

      <a-form-item label="柜门" name="title">
        <a-select ref="select" v-model:value="condition.cabinetId" allowClear>
          <a-select-option v-for="item in cabinetDoorList" :key="item.ID" :value="item.ID">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="状态" name="title">
        <a-select ref="select" v-model:value="condition.state" allowClear>
          <a-select-option :value="0">在位</a-select-option>
          <a-select-option :value="1">借出</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <div class="flex">
          <a-button @click="onReset" class="mr-4">重置</a-button>
          <a-button html-type="submit" type="primary">搜索</a-button>
        </div>
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

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emits = defineEmits(['update:visible'])
const store = useStore()
const { resetOperationTimeout } = store
const { cabinetDoorList } = storeToRefs(store)
const { getDocumentData } = useDocument()

const show = computed({
  get: () => {
    return props.visible
  },
  set: value => {
    emits('update:visible', value)
  }
})

const data = ref([])
const total = ref(0)
const condition = reactive({
  page: 1,
  size: 5,
  title: '',
  cabinetId: null,
  state: null
})

const onPageChange = async (page: number) => {
  condition.page = page
  onQueryDocumentData()
}

const onQueryDocumentData = async () => {
  const result = await getDocumentData(condition)
  data.value = result.data
  total.value = result.total
}

const onFinish = async () => {
  condition.page = 1
  onQueryDocumentData()
}

const onReset = () => {
  condition.page = 1
  condition.title = ''
  condition.cabinetId = null
  condition.state = null
  onQueryDocumentData()
}

watch(show, async value => {
  if (value) {
    onQueryDocumentData()
    resetOperationTimeout()
  }
})

const columns: ColumnsType = [
  {
    title: '文件名',
    dataIndex: 'DOC_NAME',
    key: 'DOC_NAME'
  },
  {
    title: '状态',
    dataIndex: 'DOC_REISSUENUMBER',
    key: 'DOC_REISSUENUMBER',
    customRender: ({ record }) => {
      return record.DOC_REISSUENUMBER === 0 ? '在位' : '借出'
    }
  },
  {
    title: '最后操作时间',
    dataIndex: 'DOC_LAST_TIME',
    key: 'DOC_LAST_TIME',
    customRender: ({ record }) => {
      return dayjs(record.DOC_LAST_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]

const onClose = () => {
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
</style>
