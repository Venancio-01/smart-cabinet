import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'
import { CHECK_TIME } from '@/config'
import useDocument from './useDocument'
import useCabinet from './useCabinet'

export default function () {
  const store = useStore()
  const { changeRfidIsConnected, changeCabinetDoorData, changeCheckStatusDialogVisible, changeCurrentCheckCabinetDoor } = store
  const { cabinetDoorList, misPlaceDocumentCount, isChecking } = storeToRefs(store)
  const { updateDocumentStatus, getAllDocumentData, getMisPlaceDocuments, generateCheckResult } = useDocument()
  const { getCabinetDoorInfo } = useCabinet()

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
  // const startCheck = async () => {
  //   const isConnected = await initRfid()

  //   if (!isConnected) {
  //     createAlert('读取连接设备失败')
  //     return
  //   }

  //   if (isChecking.value) {
  //     createAlert('正在盘点中')
  //     return
  //   }

  //   await sendCloseCommand()
  //   await sendOpenCommand()

  //   changeIsChecking(true)
  //   const beforeDocuments = await getAllDocumentData()
  //   const beforeMisPlaceDocumentCount = misPlaceDocumentCount.value
  //   console.log('🚀 ~ file: useRfid.ts:62 ~ startCheck ~ beforeMisPlaceDocumentCount', beforeMisPlaceDocumentCount)

  //   let timer = window.setInterval(async () => {
  //     changeCheckTime(checkTime.value - 1)

  //     if (checkTime.value === 0) {
  //       clearInterval(timer)
  //       // 发送关闭命令
  //       await sendCloseCommand()
  //       // 更新文件状态
  //       await updateDocumentStatus()
  //       // 销毁 socket 实例
  //       await destroyRfid()

  //       // 获取更新后的文件以及错位文件数量，生成盘点结果
  //       const afterDocuments = await getAllDocumentData()
  //       await getMisPlaceDocuments()
  //       const afterMisPlaceDocumentCount = misPlaceDocumentCount.value
  //       console.log('🚀 ~ file: useRfid.ts:80 ~ timer ~ afterMisPlaceDocumentCount', afterMisPlaceDocumentCount)
  //       generateCheckResult({ beforeDocuments, afterDocuments, beforeMisPlaceDocumentCount, afterMisPlaceDocumentCount })

  //       changeIsChecking(false)
  //       nextTick(() => {
  //         changeCheckTime(CHECK_TIME)
  //       })
  //     }
  //   }, 1000)
  // }

  /**
   * @description: 开启盘点
   * @return {*}
   */
  const startInventory = async (doorId: number) => {
    const door = computed(() => {
      return cabinetDoorList.value.find(item => item.id === doorId)
    })

    console.log('🚀 ~ file: useRfid.ts:108 ~ door ~ door:', door)

    if (door.value === undefined) return

    const { antenna_address: address, antenna_port: port, antenna_id: antennaId } = door.value
    if (address === null || antennaId === null) return

    const isConnected = await initRfid(address, port)
    if (!isConnected) {
      createAlert('读取连接设备失败')
      return false
    }

    const isInventory = door.value.checkCountDown !== 10
    if (isInventory) {
      createAlert('该柜门正在盘点中')
      return false
    }

    changeCurrentCheckCabinetDoor(door.value)
    // 开启盘点面板
    changeCheckStatusDialogVisible(true)

    await sendCloseCommand(address)
    await sendOpenCommand(address, antennaId)

    const timer = window.setInterval(async () => {
      if (door.value === undefined) return

      changeCabinetDoorData({
        ...door.value,
        checkCountDown: door.value.checkCountDown - 1
      })

      if (door.value.checkCountDown !== 0) return
      console.log('盘点计时结束')

      clearInterval(timer)

      // 发送关闭命令
      await sendCloseCommand(address)
      // 更新文件状态
      await updateDocumentStatus(door.value)
      // 重新获取柜门信息
      getCabinetDoorInfo()
      // 重新获取文件信息
      getAllDocumentData()
      // 重新获取错放文件数量
      getMisPlaceDocuments()

      if (door.value === undefined) return
      // 复原倒计时
      changeCabinetDoorData({ ...door.value, checkCountDown: CHECK_TIME })

      // 如果没有正在盘点的柜门，则销毁 socket 实例
      if (!isChecking.value) {
        await destroyRfid(address)
        changeCheckStatusDialogVisible(false)
      }
    }, 1000)
  }

  return {
    getRfidConnectState,
    startInventory
  }
}
