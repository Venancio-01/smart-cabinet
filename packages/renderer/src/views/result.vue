<template>
  <div class="bg-primary-color relative mx-1 flex h-full flex-col">
    <div class="blue-gradient flex h-[50px] items-center justify-end">
      <span class="mr-[20px] cursor-pointer select-none text-lg text-white underline" @click="handleRecheck">重新盘点</span>
      <span class="mr-[20px] cursor-pointer select-none text-lg text-white underline" @click="goBack">返回</span>
    </div>

    <div class="flex flex-1">
      <div class="flex-1">
        <div v-if="isEmpty" class="flex h-full items-center justify-center text-xl text-white">
            本次盘点柜内载体无变化
        </div>


        <div v-else class="result-record">
          <PerfectScrollbar>
            <div v-for="(item,index) in resultList" :key="item.id" class="border-b-2 border-white p-4 text-white" :class="[index +1 === resultList.length ? 'border-none' : '']">
              <div class="text-xl">柜门名称：{{ item.view_name }}</div>

              <div v-if="item.borrowDocuments.length !== 0">
                <div class="my-4 text-lg">本次借出载体</div>
                <a-table
                  :dataSource="item.borrowDocuments"
                  :columns="documentColumns"
                  :pagination="false"
                >
                  <template v-slot:emptyText>
                    <span>暂无数据</span>
                  </template>
                </a-table>
              </div>

              <div v-if="item.returnDocuments.length !== 0">
                <div class="my-4 text-lg">本次归还载体</div>
                <a-table
                  :dataSource="item.returnDocuments"
                  :columns="documentColumns"
                  :pagination="false"
                >
                  <template v-slot:emptyText>
                    <span>暂无数据</span>
                  </template>
                </a-table>
              </div>

              <div v-if="item.misPlaceDocumentRecords.length !== 0">
                <div class="my-4 text-lg">本柜门存在的错放载体</div>

                <a-table
                  :dataSource="item.misPlaceDocumentRecords"
                  :columns="recordColumns"
                  :pagination="false"
                >
                  <template v-slot:emptyText>
                    <span>暂无数据</span>
                  </template>
                </a-table>
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      </div>

      <div class="h-full w-[200px] border-l-[2px] border-white">
        <div class="flex h-[50px] w-full select-none items-center justify-center border-b-[2px] border-white text-lg text-white">
          统计信息
        </div>

        <div class="statistics">
          <div>共计借出载体数量：{{ statisticsData.borrow }}</div>
          <div>共计归还载体数量：{{ statisticsData.return }}</div>
          <div>共计错放载体数量：{{ statisticsData.misPlace }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import useRfid from '@/hooks/useRfid'
import useCheck from '@/hooks/useCheck'
import createAlert from '@/components/BaseAlert'
import useTime from '@/hooks/useTime'
import { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import {PerfectScrollbar} from 'vue3-perfect-scrollbar'

const router = useRouter()
const store = useStore()
const { rfidIsOnline, isLoggedIn,userList,cabinetDoorList,departmentList } = storeToRefs(store)
const checkStore = useCheckStore()
const {addLastOperationCabinetDoorRecords} = checkStore
const { checkResultList, lastOperationCabinetDoorList } = storeToRefs(checkStore)
const { takeStock } = useRfid()
const { resetCheckRecord, resetCheckResult } = useCheck()
const {
  resetOperationTimeoutCountdown,
  resetConfirmationTimeCountdown,
  openOperationTimeoutCountdown,
  closeConfirmationTimeCountdown
} = useTime()

const resultList = computed(() => {
  return checkResultList.value.filter(
    item => item.borrowDocuments.length > 0 || item.returnDocuments.length > 0 || item.misPlaceDocumentRecords.length > 0
  )
})

// 统计信息
const statisticsData = computed(() => {
  const data = checkResultList.value.reduce(
    (acc, cur) => {
      acc.borrow += cur.borrowDocuments.length
      acc.return += cur.returnDocuments.length
      acc.misPlace += cur.misPlaceDocumentRecords.length

      return acc
    },
    { borrow: 0, return: 0, misPlace: 0 }
  )

  return data
})

const isEmpty = computed(() => {
  return checkResultList.value.every(
    item => item.borrowDocuments.length === 0 && item.returnDocuments.length === 0 && item.misPlaceDocumentRecords.length === 0
  )
})

/**
 * @description: 重新盘点
 * @return {*}
 */
const handleRecheck = () => {
  resetConfirmationTimeCountdown()

  if (!rfidIsOnline.value) {
    createAlert('读取器连接失败')
    return
  }

  console.log(lastOperationCabinetDoorList.value, 'lastOperationCabinetDoorList')

  lastOperationCabinetDoorList.value.forEach(item => {
    addLastOperationCabinetDoorRecords(item)
    takeStock(item.id)
  })
}

const goBack = () => {
  closeConfirmationTimeCountdown()

  resetCheckRecord()
  resetCheckResult()

  if (isLoggedIn.value) {
    resetOperationTimeoutCountdown()
    openOperationTimeoutCountdown()

    router.replace('/main')
  } else {
    router.replace('/')
  }

}

const documentColumns:ColumnsType = [
  {
    title: '载体名',
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
    title: '最后操作用户',
    dataIndex: 'operation_user_id',
    key: 'operation_user_id',
    customRender: ({ record }) => {
      return userList.value.find(item => item.id === record.operation_user_id)?.user_name
    }
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
const recordColumns:ColumnsType = [
  {
    title: '错放内容',
    dataIndex: 'content',
    key: 'content'
  },
  {
    title: '错放柜门',
    dataIndex: 'cabinet_door_id',
    key: 'cabinet_door_id',
    customRender: ({ record }) => {
      return cabinetDoorList.value.find(item => item.id === record.cabinet_door_id)?.view_name
    }
    },
]
</script>

<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css"/>
<style scoped>
.statistics div {
  @apply my-4 px-2 text-lg text-white;
}

.result-record h3 {
  @apply text-white;
}

.ps {
  height: calc(100vh - 150px);
}
</style>
