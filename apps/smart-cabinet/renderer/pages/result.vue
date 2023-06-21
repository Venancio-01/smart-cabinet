<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/lib/table/interface'
import dayjs from 'dayjs'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import type { DocDocument, RfidSwitchRecord } from 'database'
import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import useCheck from '@/hooks/useCheck'
import useCheckRecord from '@/hooks/useCheckRecord'
import useTime from '@/hooks/useTime'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const store = useStore()
const { isLoggedIn, userList, cabinetDoorList, departmentList } = storeToRefs(store)
const checkStore = useCheckStore()
const { addLastOperationCabinetDoorRecords } = checkStore
const { checkResultList, lastOperationCabinetDoorList } = storeToRefs(checkStore)
const { handleCheck } = useCheck()
const { resetCheckRecord, resetCheckResult } = useCheckRecord()
const {
  resetOperationTimeoutCountdown,
  resetConfirmationTimeCountdown,
  openOperationTimeoutCountdown,
  closeConfirmationTimeCountdown,
  confirmTimeout,
} = useTime()

// 统计信息
const statisticsData = computed(() => {
  const data = checkResultList.value.reduce(
    (acc, cur) => {
      acc.borrow += cur.borrowCarriers.length
      acc.return += cur.returnCarriers.length
      acc.misPlace += cur.misPlaceCarrierRecords.length

      return acc
    },
    { borrow: 0, return: 0, misPlace: 0 },
  )

  return data
})

// 判断该柜门内载体是否有变化
function isCabinetDoorChanged(id: number) {
  const cabinetDoor = checkResultList.value.find((item) => item.id === id)

  if (!cabinetDoor) return false

  const { borrowCarriers, returnCarriers, misPlaceCarrierRecords } = cabinetDoor

  return borrowCarriers.length > 0 || returnCarriers.length > 0 || misPlaceCarrierRecords.length > 0
}

/**
 * @description: 重新盘点
 * @return {*}
 */
function handleRecheck() {
  resetConfirmationTimeCountdown()

  lastOperationCabinetDoorList.value.forEach((item) => {
    addLastOperationCabinetDoorRecords(item)
    handleCheck(item.id)
  })
}

function goBack() {
  closeConfirmationTimeCountdown()

  resetCheckRecord()
  resetCheckResult()

  if (isLoggedIn.value) {
    resetOperationTimeoutCountdown()
    openOperationTimeoutCountdown()

    router.replace('/main/cabinet-door')
  } else {
    router.replace('/')
  }
}

const documentColumns: ColumnsType<DocDocument> = [
  {
    title: '载体名',
    dataIndex: 'docName',
    key: 'docName',
  },
  {
    title: '所属柜门',
    dataIndex: 'viewName',
    key: 'viewName',
    customRender: ({ record }) => {
      return cabinetDoorList.value.find((item) => item.id === record.cabinetDoorId)?.viewName
    },
  },
  {
    title: '所属机构',
    dataIndex: 'department',
    key: 'department',
    customRender: ({ record }) => {
      return departmentList.value.find((item) => item.deptId === record.deptId)?.deptName
    },
  },
  {
    title: '最后操作用户',
    dataIndex: 'docLastUserId',
    key: 'docLastUserId',
    customRender: ({ record }) => {
      return userList.value.find((item) => Number(item.userId) === record.docLastUserId)?.userName
    },
  },
  {
    title: '最后操作时间',
    dataIndex: 'docLastTime',
    key: 'docLastTime',
    customRender: ({ record }) => {
      return dayjs(record.docLastTime).format('YYYY-MM-DD HH:mm:ss')
    },
  },
]
const recordColumns: ColumnsType<RfidSwitchRecord> = [
  {
    title: '错放内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '错放柜门',
    dataIndex: 'cabinetDoorId',
    key: 'cabinetDoorId',
    customRender: ({ record }) => {
      return cabinetDoorList.value.find((item) => item.id === Number(record.cabinetDoorId))?.viewName
    },
  },
]
</script>

<template>
  <div class="">
    <div class="flex h-[50px] items-center justify-between">
      <BackButton :on-back="goBack" />

      <div class="flex items-center">
        <div class="text-light mr-12">
          <span class="font-large mr-2 font-['Barlow']">{{ confirmTimeout }}</span>
          秒后自动退出
        </div>
        <a-button type="primary" @click="handleRecheck"> 重新盘点 </a-button>
      </div>
    </div>

    <div class="flex flex-1 gap-x-6">
      <div class="flex-1">
        <div class="result-record">
          <PerfectScrollbar>
            <div
              v-for="(item, index) in checkResultList"
              :key="item.id"
              class="border-b-2 border-white text-white mt-4"
              :class="[index + 1 === checkResultList.length ? 'border-none' : '']">
              <div class="font-large">柜门名称：{{ item.viewName }}</div>

              <div v-if="isCabinetDoorChanged(item.id)">
                <div v-if="item.borrowCarriers.length !== 0">
                  <div class="my-4">本次领用载体</div>
                  <a-table :data-source="item.borrowCarriers" :columns="documentColumns" :pagination="false">
                    <template #emptyText>
                      <span>暂无数据</span>
                    </template>
                  </a-table>
                </div>

                <div v-if="item.returnCarriers.length !== 0">
                  <div class="my-4">本次归还载体</div>
                  <a-table :data-source="item.returnCarriers" :columns="documentColumns" :pagination="false">
                    <template #emptyText>
                      <span>暂无数据</span>
                    </template>
                  </a-table>
                </div>

                <div v-if="item.misPlaceCarrierRecords.length !== 0">
                  <div class="my-4">本柜门存在的错放载体</div>

                  <a-table :data-source="item.misPlaceCarrierRecords" :columns="recordColumns" :pagination="false">
                    <template #emptyText>
                      <span>暂无数据</span>
                    </template>
                  </a-table>
                </div>
              </div>

              <div v-else class="flex-center-center h-[150px] text-gray-600 bg-white my-4">本次盘点该柜门载体无变化</div>
            </div>
          </PerfectScrollbar>
        </div>
      </div>

      <div class="h-full w-[200px] py-4">
        <div class="flex font-large w-full select-none items-center justify-center text-white">统计信息</div>

        <div class="statistics mt-4">
          <div class="!mt-0">共计领用载体数量：{{ statisticsData.borrow }}</div>
          <div>共计归还载体数量：{{ statisticsData.return }}</div>
          <div>共计错放载体数量：{{ statisticsData.misPlace }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css" />

<style scoped>
.statistics div {
  @apply my-4 px-2 text-white;
}

.result-record h3 {
  @apply text-white;
}
.ps {
  height: calc(100vh - 150px);
}
</style>
