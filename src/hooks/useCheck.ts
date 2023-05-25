import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import { doc_document } from '@prisma/client'
import { CHECK_TIME } from '@/config'
import useCarrier from './useCarrier'
import useTime from '@/hooks/useTime'
import useRfid from '@/hooks/useRfid'
import createAlert from '@/components/BaseAlert'

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setCabinetDoor, setCheckStatusDialogVisible, setCurrentCheckCabinetDoorId } = store
  const { cabinetDoorList, isChecking, rfidIsOnline } = storeToRefs(store)
  const checkStore = useCheckStore()
  const { setCheckResultList, addLastOperationCabinetDoorRecords,clearLastOperationCabinetDoorRecords, changeLastOperationCabinetDoorList } = checkStore
  const {
    firstCarrierRecord,
    endCarrierRecord,
    endMisPlaceCarrierRecord,
    lastOperationCabinetDoorRecords,
    lastOperationCabinetDoorList
  } = storeToRefs(checkStore)
  const { updateCarrier, recordDataWhenCheckEnd, recordDataWhenCheckStart } = useCarrier()
  const { resetCountdowns, resetConfirmationTimeCountdown, resetOperationTimeoutCountdown, closeOperationTimeoutCountdown, openConfirmationTimeCountdown } =
    useTime()

  const { initRfid, handleOpenRfid, handleCloseRfid } = useRfid()

  /**
   * @description: 生成盘点结果数据
   * @return {*}
   */
  const generateCheckResult = () => {
    // 生成借出文件数据
    const borrowCarriers = firstCarrierRecord.value.reduce<doc_document[]>((acc, cur, index) => {
      if (cur.loan_status === 0 && endCarrierRecord.value[index].loan_status === 1) {
        acc.push(endCarrierRecord.value[index])
      }
      return acc
    }, [])

    // 生成归还文件数据
    const returnCarriers = firstCarrierRecord.value.reduce<doc_document[]>((acc, cur, index) => {
      if (cur.loan_status === 1 && endCarrierRecord.value[index].loan_status === 0) {
        acc.push(endCarrierRecord.value[index])
      }
      return acc
    }, [])

    // 生成错放文件数据
    const misPlaceCarrierRecords = endMisPlaceCarrierRecord.value

    const result: CheckResultType[] = cabinetDoorList.value.map(door => {
      const currentDoorBorrowCarriers = borrowCarriers.filter(item => item.cabinet_door_id === door.id)
      const currentDoorReturnCarriers = returnCarriers.filter(item => item.cabinet_door_id === door.id)

      // 如果是本次操作的柜门，则显示错放文件数据
      const isOperationCabinetDoor = lastOperationCabinetDoorList.value.find(item => item.id === door.id)
      const currentDoorMisPlaceCarrierRecords = isOperationCabinetDoor
        ? misPlaceCarrierRecords.filter(item => item.cabinet_door_id === door.id)
        : []

      return {
        ...door,
        borrowCarriers: currentDoorBorrowCarriers,
        returnCarriers: currentDoorReturnCarriers,
        misPlaceCarrierRecords: currentDoorMisPlaceCarrierRecords
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
      const door = cabinetDoorList.value.find(item => item.id === doorId)
      if (door === undefined) return

      setCabinetDoor({
        ...door,
        checkCountdown: door.checkCountdown - 1
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
    const door = cabinetDoorList.value.find(item => item.id === doorId)
    if (door === undefined || door.antenna_address === null) return

    // 更新载体状态
    await updateCarrier(door)
    // 关闭读取器
    await handleCloseRfid(door.antenna_address)

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
    // 生成盘点结果
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
   * @description: 开启盘点
   * @return {*}
   */
  const handleCheck = async (doorId: number) => {
    resetCountdowns()

    const selectedDoor = cabinetDoorList.value.find(item => item.id === doorId)
    if (selectedDoor === undefined) return

    const { antenna_address: address, antenna_port: port, antenna_id: antennaId } = selectedDoor
    if (address === null || antennaId === null) return

    const isConnected = await initRfid(address, port)
    if (!isConnected) {
      createAlert('读取连接设备失败')
      return false
    }

    // 如果该柜门正在盘点中
    const selectedDoorIsChecking = selectedDoor.checkCountdown !== 10
    if (selectedDoorIsChecking) {
      createAlert('该柜门正在盘点中')
      return false
    }

    // 记录本次盘点操作的柜门
    setCurrentCheckCabinetDoorId(selectedDoor.id)
    // 开启盘点面板
    setCheckStatusDialogVisible(true)

    // 开启读取器
    await handleOpenRfid(address, antennaId)

    const stopCheckCountdown = await startCheckCountdown(selectedDoor.id, async () => {
      stopCheckCountdown()
      await onCheckCountdownEnd(selectedDoor.id)

      if (isChecking.value) return
      await onAllCheckEnd()
    })
  }

  const handleManualCheck = () => {
    resetOperationTimeoutCountdown()

    if (!rfidIsOnline.value) {
      createAlert('读取器连接失败')
      return
    }

    // 记录盘点开始时的载体数据
    recordDataWhenCheckStart()

    cabinetDoorList.value.forEach(door => {
      addLastOperationCabinetDoorRecords(door)
      handleCheck(door.id)
    })
  }

  return {
    generateCheckResult,
    handleManualCheck,
    handleCheck
  }
}
