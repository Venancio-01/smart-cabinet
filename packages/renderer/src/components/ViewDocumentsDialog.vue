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
          <a-select-option :value="2">错放</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item class="row-span-2" :wrapper-col="{ span: 24 }">
        <div class="flex h-full w-full items-center justify-center">
          <a-button html-type="submit" type="primary">搜索</a-button>
          <a-button @click="handleReset" class="ml-4">重置</a-button>
        </div>
      </a-form-item>

      <a-form-item v-show="currentCabinetDoorId === 0" label="所属柜门" name="title">
        <a-select ref="select" v-model:value="condition.cabinetId" allowClear>
          <a-select-option v-for="item in cabinetDoorList" :key="item.id" :value="item.id">{{ item.view_name }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-show="currentCabinetDoorId === 0" label="所属部门" name="title">
        <a-select ref="select" v-model:value="condition.departmentId" allowClear>
          <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{ item.dept_name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <DocumentTable :total="total" :data="data" :condition="{page:condition.page,size:condition.size}" @on-page-change="onPageChange"/>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useTime from '@/hooks/useTime'
import useViewDocuments from '@/hooks/useViewDocuments'

const store = useStore()
const { changeViewDocumentVisible } = store
const { cabinetDoorList, viewDocumentVisible, departmentList, currentCabinetDoorId,reviewDocumentCondition } =
  storeToRefs(store)
const { resetOperationTimeoutCountdown } = useTime()
const {DocumentTable,getDocuments,data,total} = useViewDocuments()

const show = computed({
  get: () => {
    return viewDocumentVisible.value
  },
  set: value => {
    changeViewDocumentVisible(value)
  }
})

const condition = reactive<DocumentQueryProps>({
  page: 1,
  size: 5,
  title: '',
  cabinetId: null,
  departmentId: null,
  state: null
})

const onPageChange = async (page: number) => {
  condition.page = page

  getDocuments(condition)
}


const onFinish = async () => {
  condition.page = 1

  getDocuments(condition)
}

const handleReset = () => {
  condition.page = 1
  condition.title = ''
  condition.cabinetId = reviewDocumentCondition.value.cabinetDoorId
  condition.departmentId = null
  condition.state = reviewDocumentCondition.value.state
  data.value = []

  getDocuments(condition)
}

watch(show, async value => {
  resetOperationTimeoutCountdown()

  if (!value) return
  condition.cabinetId = reviewDocumentCondition.value.cabinetDoorId
  condition.state = reviewDocumentCondition.value.state

  getDocuments(condition)
})

const onClose = () => {
  handleReset()
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
