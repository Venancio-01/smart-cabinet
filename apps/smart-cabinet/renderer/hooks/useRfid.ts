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
    const list: CabinetDoorProps[] = []

    for (let i = 0; i < cabinetDoorList.value.length; i++) {
      const cabinetDoor = cabinetDoorList.value[i]
      if (cabinetDoor.txAddr === null) continue

      const isConnected = await window.JSBridge.rfid.init(cabinetDoor.txAddr, 8899)
      window.JSBridge.rfid.destroy(cabinetDoor.txAddr)

      const item = {
        ...cabinetDoor,
        rfidIsConnected: isConnected,
      }

      list.push(item)
    }

    setCabinetDoorList(list)
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
