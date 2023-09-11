import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setCabinetDoorList } = store
  const { cabinetDoorList } = storeToRefs(store)

  /**
   * @description: 获取读写器连接状态
   * @return {*}
   */
  const getRFIDConnectionStatus = async () => {
    const promiseList = cabinetDoorList.value.reduce((acc, cur) => {
      if (cur.txAddr !== null) acc.push(window.JSBridge.rfid.init(cur.txAddr, 8899))
      return acc
    }, [] as Promise<boolean>[])

    const connectResultList = await Promise.all(promiseList)

    const list = cabinetDoorList.value.map((item, index) => {
      return {
        ...item,
        rfidIsConnected: connectResultList[index],
      }
    })

    setCabinetDoorList(list)

    list.forEach((item) => {
      if (item.txAddr) window.JSBridge.rfid.destroy(item.txAddr)
    })
  }

  /**
   * @description: 打开读写器
   * @param {string} address
   * @param {string} antennaIds
   * @return {*}
   */
  const handleOpenRfid = async (address: string, antennaIds: string) => {
    window.JSBridge.rfid.sendCloseCommand(address)

    const antennaIdList = antennaIds.split(',').map((item) => Number(item))
    window.JSBridge.rfid.sendOpenCommand(address, antennaIdList)
  }

  /**
   * @description: 关闭读写器,并销毁 socket
   * @param {string} address
   * @return {*}
   */
  const handleCloseRfid = async (address: string) => {
    window.JSBridge.rfid.sendCloseCommand(address)
    window.JSBridge.rfid.destroy(address)
  }

  return {
    getRFIDConnectionStatus,
    handleOpenRfid,
    handleCloseRfid,
  }
}
