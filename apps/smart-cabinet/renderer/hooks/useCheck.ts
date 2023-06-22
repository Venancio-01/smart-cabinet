import type { DocDocument } from 'database'
import { Modal } from 'ant-design-vue'
import { CHECK_TIME } from 'utils/config/renderer'
import useCarrier from './useCarrier'
import { BorrowedState } from '~/enums'
import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import useTime from '@/hooks/useTime'
import useRfid from '@/hooks/useRfid'
import createAlert from '@/components/BaseAlert'

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setCabinetDoor, setCheckStatusDialogVisible, setCurrentCheckCabinetDoorId } = store
  const { cabinetDoorList, isChecking } = storeToRefs(store)
  const checkStore = useCheckStore()
  const {
    setCheckResultList,
    addLastOperationCabinetDoorRecords,
    clearLastOperationCabinetDoorRecords,
    changeLastOperationCabinetDoorList,
  } = checkStore
  const { firstCarrierRecord, endCarrierRecord, endMisPlaceCarrierRecord, lastOperationCabinetDoorRecords, lastOperationCabinetDoorList } =
    storeToRefs(checkStore)
  const { updateCarrier, recordDataWhenCheckEnd, recordDataWhenCheckStart } = useCarrier()
  const {
    resetCountdowns,
    resetConfirmationTimeCountdown,
    resetOperationTimeoutCountdown,
    closeOperationTimeoutCountdown,
    openConfirmationTimeCountdown,
  } = useTime()

  const { initRfid, handleOpenRfid, handleCloseRfid } = useRfid()
  /**
   * @description: 生成盘点结果数据
   * @return {*}
   */
  const generateCheckResult = () => {
    const borrowCarriers: DocDocument[] = []
    const returnCarriers: DocDocument[] = []

    firstCarrierRecord.value.forEach((item, index) => {
      const endCarrier = endCarrierRecord.value[index]
      if (item.docPStatus === BorrowedState.Returned && endCarrier.docPStatus === BorrowedState.Borrowed) {
        borrowCarriers.push(endCarrier)
      } else if (item.docPStatus === BorrowedState.Borrowed && endCarrier.docPStatus === BorrowedState.Returned) {
        returnCarriers.push(endCarrier)
      }
    })

    // 生成错放文件数据
    const misPlaceCarrierRecords = endMisPlaceCarrierRecord.value

    const result: CheckResultType[] = cabinetDoorList.value.map((door) => {
      const currentDoorBorrowCarriers = borrowCarriers.filter((item) => item.cabinetDoorId === door.id)
      const currentDoorReturnCarriers = returnCarriers.filter((item) => item.cabinetDoorId === door.id)

      // 如果是本次操作的柜门，则显示错放文件数据
      const isOperationCabinetDoor = lastOperationCabinetDoorList.value.find((item) => item.id === door.id)
      const currentDoorMisPlaceCarrierRecords = isOperationCabinetDoor
        ? misPlaceCarrierRecords.filter((item) => Number(item.cabinetDoorId) === door.id)
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
   * @param {function} callback
   * @return {*}
   */
  const startCheckCountdown = (doorId: number, callback: () => void) => {
    const timer = window.setInterval(async () => {
      const door = cabinetDoorList.value.find((item) => item.id === doorId)
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
  const onCheckCountdownEnd = async (doorId: number) => {
    const door = cabinetDoorList.value.find((item) => item.id === doorId)
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
  const onAllCheckEnd = async () => {
    // 记录盘点结束时的载体数据
    await recordDataWhenCheckEnd()

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
   * @return {*}
   */
  const handleCheck = async (doorId: number) => {
    resetCountdowns()

    const currentDoor = cabinetDoorList.value.find((item) => item.id === doorId)
    if (currentDoor === undefined) return

    const { txAddr: address, txId: antennaId } = currentDoor
    if (address === null || antennaId === null) return

    const isConnected = await initRfid(address, 8899)
    if (!isConnected) {
      createAlert('读取连接设备失败')
      return false
    }

    // 如果该柜门正在盘点中
    const currentDoorIsChecking = currentDoor.checkCountdown !== 10
    if (currentDoorIsChecking) {
      createAlert('该柜门正在盘点中')
      return false
    }

    // 记录本次盘点操作的柜门
    setCurrentCheckCabinetDoorId(currentDoor.id)
    // 开启盘点面板
    setCheckStatusDialogVisible(true)

    // 开启读取器
    handleOpenRfid(address, antennaId)

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
  const handleManualCheck = () => {
    // 记录盘点开始时的载体数据
    recordDataWhenCheckStart()

    const noAvailableRfid = cabinetDoorList.value.every((item) => !item.rfidIsConnected)
    if (noAvailableRfid) {
      createAlert('RFID 读取器连接失败')
      return
    }

    const availableCabinetDoors = cabinetDoorList.value.filter((item) => item.rfidIsConnected)
    if (availableCabinetDoors.length !== cabinetDoorList.value.length) {
      const unavailableCabinetDoorNames = cabinetDoorList.value
        .filter((item) => !item.rfidIsConnected)
        .map((item) => item.name)
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
    } else {
      cabinetDoorList.value.forEach((door) => {
        addLastOperationCabinetDoorRecords(door)
        handleCheck(door.id)
      })
    }
  }

  return {
    generateCheckResult,
    handleManualCheck,
    handleCheck,
  }
}
