import type { DocDocument } from '@smart-cabinet/database'
import { Modal } from 'ant-design-vue'
import { CHECK_TIME } from '@smart-cabinet/utils/config/renderer'
import { BorrowedState } from '~/enums'

import createAlert from '@/components/BaseAlert'
import { handleCloseRfid, handleInitRfidConnection, handleStartRfidReading } from '@/features/rfid'
import { initCarrierData, recordDataWhenCheckStart, updateCarrier } from '@/features/carrier'
import {
  closeOperationTimeoutCountdown,
  openConfirmationTimeCountdown,
  resetConfirmationTimeCountdown,
  resetCountdowns,
} from '@/features/time'
import { useGlobalState } from '@/store'
import router from '@/router'

const {
  setCabinetDoor,
  setCheckStatusDialogVisible,
  setCurrentCheckCabinetDoorId,
  setCheckResultList,
  addLastOperationCabinetDoorRecords,
  clearLastOperationCabinetDoorRecords,
  changeLastOperationCabinetDoorList,
} = useGlobalState()

const {
  cabinetDoorList,
  isChecking,
  initialCarrierList,
  carrierList,
  misPlaceCarrierList,
  lastOperationCabinetDoorRecords,
  lastOperationCabinetDoorList,
} = useGlobalState()

/**
 * @description: 生成盘点结果数据
 * @return {*}
 */
function generateCheckResult() {
  const borrowCarriers: DocDocument[] = []
  const returnCarriers: DocDocument[] = []

  initialCarrierList.value.forEach((item, index) => {
    const endCarrier = carrierList.value[index]
    if (item.docPStatus === BorrowedState.Returned && endCarrier.docPStatus === BorrowedState.Borrowed) {
      borrowCarriers.push(endCarrier)
    }
    else if (item.docPStatus === BorrowedState.Borrowed && endCarrier.docPStatus === BorrowedState.Returned) {
      returnCarriers.push(endCarrier)
    }
  })

  // 生成错放文件数据
  const misPlaceCarrierRecords = misPlaceCarrierList.value

  const result: CheckResultType[] = cabinetDoorList.value.map((door) => {
    const currentDoorBorrowCarriers = borrowCarriers.filter(item => item.cabinetDoorId === door.id)
    const currentDoorReturnCarriers = returnCarriers.filter(item => item.cabinetDoorId === door.id)

    // 如果是本次操作的柜门，则显示错放文件数据
    const isOperationCabinetDoor = lastOperationCabinetDoorList.value.find(item => item.id === door.id)
    const currentDoorMisPlaceCarrierRecords = isOperationCabinetDoor
      ? misPlaceCarrierRecords.filter(item => Number(item.doorid) === door.id)
      : []

    return {
      ...door,
      borrowCarriers: currentDoorBorrowCarriers,
      returnCarriers: currentDoorReturnCarriers,
      misPlaceCarrierRecords: currentDoorMisPlaceCarrierRecords,
    }
  })

  setCheckResultList(result)
}

/**
 * @description: 开启盘点倒计时
 * @param {CabinetDoorProps} door
 * @param {Function} callback
 * @return {*}
 */
function startCheckCountdown(doorId: number, callback: () => void) {
  const timer = window.setInterval(async () => {
    const door = cabinetDoorList.value.find(item => item.id === doorId)
    if (door === undefined) return

    setCabinetDoor({
      ...door,
      checkCountdown: door.checkCountdown - 1,
    })

    if (door.checkCountdown !== 0) return
    callback()
  }, 1000)

  return () => {
    clearInterval(timer)
  }
}

/**
 * @description: 当盘点倒计时结束时
 * @param {CabinetDoorProps} door
 * @return {*}
 */
export async function onCheckCountdownEnd(doorId: number) {
  const door = cabinetDoorList.value.find(item => item.id === doorId)
  if (door === undefined || door.txAddr === null) return

  // 更新载体状态
  await updateCarrier(door)
  // 关闭读取器
  await handleCloseRfid(door.txAddr)

  // 复原倒计时
  setCabinetDoor({ ...door, checkCountdown: CHECK_TIME })
}

/**
 * @description: 当所有柜门盘点结束时
 * @return {*}
 */
export async function onAllCheckEnd() {
  // 盘点结束时刷新载体数据
  await initCarrierData()

  // 记录本次盘点操作的的柜门
  changeLastOperationCabinetDoorList(lastOperationCabinetDoorRecords.value)
  // 清空这一次操作的柜门记录
  clearLastOperationCabinetDoorRecords()
  // 生成盘点结果数据
  generateCheckResult()

  // 关闭操作超时倒计时
  closeOperationTimeoutCountdown()
  // 重置确认倒计时
  resetConfirmationTimeCountdown()
  // 开启确认倒计时
  openConfirmationTimeCountdown()

  // 跳转盘点结果页面
  router.push('/result')
}

/**
 * @description: 进行盘点
 */
export async function handleCheck(doorId: number) {
  resetCountdowns()

  const currentDoor = cabinetDoorList.value.find(item => item.id === doorId)
  if (currentDoor === undefined) return

  const { txAddr: address, txId: antennaId } = currentDoor
  if (address === null || antennaId === null) {
    createAlert('RFID 读取器连接失败')
    return
  }

  if (!currentDoor.rfidIsConnected) {
    createAlert('RFID 读取器未连接')
    return
  }

  // 如果该柜门正在盘点中
  const currentDoorIsChecking = currentDoor.checkCountdown !== CHECK_TIME
  if (currentDoorIsChecking) {
    createAlert('该柜门正在盘点中')
    return
  }

  // 记录本次盘点操作的柜门
  setCurrentCheckCabinetDoorId(currentDoor.id)
  // 显示盘点面板
  setCheckStatusDialogVisible(true)

  // 初始化读取器连接
  await handleInitRfidConnection(address)
  // 读取器开始读取
  handleStartRfidReading(address, antennaId)

  const stopCheckCountdown = await startCheckCountdown(currentDoor.id, async () => {
    stopCheckCountdown()
    await onCheckCountdownEnd(currentDoor.id)

    if (isChecking.value) return
    await onAllCheckEnd()
  })
}

/**
 * @description: 手动盘点
 * @return {*}
 */
export function handleManualCheck() {
  // 记录盘点开始时的载体数据
  recordDataWhenCheckStart()

  const noAvailableRfid = cabinetDoorList.value.every(item => !item.rfidIsConnected)
  if (noAvailableRfid) {
    createAlert('RFID 读取器连接失败')
    return
  }

  const availableCabinetDoors = cabinetDoorList.value.filter(item => item.rfidIsConnected)
  if (availableCabinetDoors.length !== cabinetDoorList.value.length) {
    const unavailableCabinetDoorNames = cabinetDoorList.value
      .filter(item => !item.rfidIsConnected)
      .map(item => item.name)
      .join('、')

    Modal.confirm({
      title: '提示',
      content: `柜门${unavailableCabinetDoorNames}的 RFID 读取器连接失败，是否继续盘点？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        availableCabinetDoors.forEach((door) => {
          addLastOperationCabinetDoorRecords(door)
          handleCheck(door.id)
        })
      },
    })
  }
  else {
    cabinetDoorList.value.forEach((door) => {
      addLastOperationCabinetDoorRecords(door)
      handleCheck(door.id)
    })
  }
}
