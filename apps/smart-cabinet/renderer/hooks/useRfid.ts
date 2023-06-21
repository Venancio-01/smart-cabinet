import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setCabinetDoorList } = store
  const { cabinetDoorList } = storeToRefs(store)

  /**
   * @description: 获取读写器连接状态
   * @return {*}
   */
  const getConnectState = async () => {
    const list: CabinetDoorProps[] = []

    for (let i = 0; i < cabinetDoorList.value.length; i++) {
      const cabinetDoor = cabinetDoorList.value[i]
      if (cabinetDoor.txAddr === null) continue

      const connectStatus = await window.JSBridge.rfid.init(cabinetDoor.txAddr, 8899)
      await window.JSBridge.rfid.destroy(cabinetDoor.txAddr)

      const item = {
        ...cabinetDoor,
        rfidIsConnected: connectStatus,
      }

      list.push(item)
    }

    setCabinetDoorList(list)
  }

  /**
   * @description: 初始化读写器
   * @param {string} address
   * @param {number} port
   * @return {*}
   */
  const initRfid = async (address: string, port: number) => {
    const isConnected = await window.JSBridge.rfid.init(address, port)
    return isConnected
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
    getConnectState,
    initRfid,
    handleOpenRfid,
    handleCloseRfid,
  }
}
