<template>
  <div class="bg-primary-color mx-1 flex h-full flex-col">
    <!-- 头部 -->
    <div class="blue-gradient flex h-[50px] items-center justify-between">
      <span>
        <span v-if="isLoggedIn" class="ml-[20px] select-none text-lg text-white" @click="goCabinetDoorPage">柜门信息</span>
        <span class="ml-[20px] select-none text-lg text-white underline">载体信息</span>
      </span>
      <span v-if="isLoggedIn" class="mr-[20px] cursor-pointer select-none text-lg text-white underline" @click="handleLogout">注销</span>
      <span v-else class="mr-[20px] cursor-pointer select-none text-lg text-white underline" @click="goBack">返回</span>
    </div>

    <a-form
      :model="condition"
      name="basic"
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 14 }"
      class="gird-rows-1 grid grid-cols-[1fr_1fr_1fr_1fr_200px] py-4"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item label="载体名称" name="title">
        <a-input v-model:value="condition.title" />
      </a-form-item>

      <a-form-item label="状态" name="title">
        <a-select ref="select" v-model:value="condition.state" allowClear>
          <a-select-option :value="0">在位</a-select-option>
          <a-select-option :value="1">借出</a-select-option>
          <a-select-option :value="2">错放</a-select-option>
        </a-select>
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

      <a-form-item class="row-span-2" :wrapper-col="{ span: 24 }">
        <div class="flex h-full w-full items-center justify-center">
          <a-button html-type="submit" type="primary">搜索</a-button>
          <a-button @click="handleInit" class="ml-4">重置</a-button>
        </div>
      </a-form-item>
    </a-form>

    <div class="px-4">
      <DocumentTable :total="total" :data="data" :condition="{page:condition.page,size:condition.size}" @on-page-change="onPageChange"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useStore } from '@/store'
import useTime from '@/hooks/useTime'
import useViewDocuments from '@/hooks/useViewDocuments'
import useLogin from '@/hooks/useLogin'

const router = useRouter()
const route = useRoute()
const store = useStore()
const {  } = store
const { isLoggedIn, cabinetDoorList, departmentList, currentCabinetDoorId } =
  storeToRefs(store)
const { resetOperationTimeoutCountdown } = useTime()
const {DocumentTable,getDocuments,data,total} = useViewDocuments()
const { handleLogout } = useLogin()

const condition = reactive<DocumentQueryProps>({
  page: 1,
  size: 8,
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

const handleInit = () => {
  const state = route.params.state === 'null' ? null : Number(route.params.state)

  condition.page = 1
  condition.title = ''
  condition.cabinetId = null
  condition.departmentId = null
  condition.state = state
  data.value = []

  getDocuments(condition)
}

const goCabinetDoorPage = () =>{
  resetOperationTimeoutCountdown()
  router.push('/main')
}

const goBack = () => {
  router.replace('/')
}

onMounted(()=>{
  handleInit()
})
watch(route,() => {
  handleInit()
})

</script>
