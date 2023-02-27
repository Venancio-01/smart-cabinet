import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import createAlert from '@/components/BaseAlert'
import { CHECK_TIME } from '@/config'
import useDocument from './useDocument'
import useCheck from './useCheck'
import useTime from '@/hooks/useTime'

export default function () {
  const router = useRouter()
  const store = useStore()
  const {
    changeRfidIsConnected,
    changeCabinetDoorData,
    changeCheckStatusDialogVisible,
    changeCurrentCheckCabinetDoorId,
    changeViewDocumentVisible
  } = store
  const { cabinetDoorList, isChecking } = storeToRefs(store)
  const checkStore = useCheckStore()
  const { clearLastOperationCabinetDoorRecords, changeLastOperationCabinetDoorList } = checkStore
  const { lastOperationCabinetDoorRecords } = storeToRefs(checkStore)
  const { updateDocumentStatus, recordDataWhenCheckEnd } = useDocument()
  const { generateCheckResult } = useCheck()
  const {
    resetOperationTimeoutCountdown,
    resetConfirmationTimeCountdown,
    closeOperationTimeoutCountdown,
    openConfirmationTimeCountdown
  } = useTime()

  // 获取 RFID 连接状态
  const getRfidConnectState = async () => {
    const result = []
    for (let i = 0; i < cabinetDoorList.value.length; i++) {
      const { antenna_address, antenna_port } = cabinetDoorList.value[i]
      if (antenna_address === null) continue
      result.push(await window.JSBridge.rfid.init(antenna_address, antenna_port))
      await destroyRfid(antenna_address)
    }

    const isConnected = result.every(Boolean)
    changeRfidIsConnected(isConnected)
    return isConnected
  }

  const initRfid = async (address: string, port: number) => {
    const isConnected = await window.JSBridge.rfid.init(address, port)
    changeRfidIsConnected(isConnected)
    return isConnected
  }

  const destroyRfid = async (address: string) => {
    return await window.JSBridge.rfid.destroy(address)
  }

  const sendOpenCommand = async (address: string, antennaIds: string) => {
    const antennaIdList = antennaIds.split(',').map(item => Number(item))
    return await window.JSBridge.rfid.sendOpenCommand(address, antennaIdList)
  }

  const sendCloseCommand = async (address: string) => {
    return await window.JSBridge.rfid.sendCloseCommand(address)
  }

  /**
   * @description: 开启盘点
   * @return {*}
   */
  const takeStock = async (doorId: number) => {
    resetOperationTimeoutCountdown()
    resetConfirmationTimeCountdown()

    const door = computed(() => {
      return cabinetDoorList.value.find(item => item.id === doorId)
    })

    if (door.value === undefined) return

    const { antenna_address: address, antenna_port: port, antenna_id: antennaId } = door.value
    if (address === null || antennaId === null) return

    const isConnected = await initRfid(address, port)
    if (!isConnected) {
      createAlert('读取连接设备失败')
      return false
    }

    const isInventory = door.value.checkCountdown !== 10
    if (isInventory) {
      createAlert('该柜门正在盘点中')
      return false
    }

    changeCurrentCheckCabinetDoorId(door.value.id)
    // 开启盘点面板
    changeCheckStatusDialogVisible(true)

    await sendCloseCommand(address)
    await sendOpenCommand(address, antennaId)

    const timer = window.setInterval(async () => {
      if (door.value === undefined) return

      changeCabinetDoorData({
        ...door.value,
        checkCountdown: door.value.checkCountdown - 1
      })

      if (door.value.checkCountdown !== 0) return

      clearInterval(timer)

      // 发送关闭命令
      await sendCloseCommand(address)
      // 更新文件状态
      await updateDocumentStatus(door.value)

      if (door.value === undefined) return

      // 复原倒计时
      changeCabinetDoorData({ ...door.value, checkCountdown: CHECK_TIME })

      // 销毁 socket 实例
      await destroyRfid(address)

      // 如果没有正在盘点的柜门
      if (!isChecking.value) {
        // 记录盘点结束时的文件数据
        await recordDataWhenCheckEnd()

        // 关闭查看文件弹出框
        changeViewDocumentVisible(false)

        console.log(lastOperationCabinetDoorRecords.value,'lastOperationCabinetDoorRecords.value')

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
    }, 1000)
  }

  return {
    getRfidConnectState,
    takeStock
  }
}
