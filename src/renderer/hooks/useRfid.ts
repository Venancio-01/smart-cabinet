import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setRfidIsConnected, setRfidConnectionStatus } = store
  const { cabinetDoorList } = storeToRefs(store)

  /**
   * @description: 获取读写器连接状态
   * @return {*}
   */
  const getRfidConnectState = async () => {
    const list: CabinetDoorProps[] = []

    for (let i = 0; i < cabinetDoorList.value.length; i++) {
      const cabinetDoor = cabinetDoorList.value[i]
      if (cabinetDoor.txAddr === null)
        continue
      const item = {
        ...cabinetDoor,
        rfidIsConnected: await window.JSBridge.rfid.init(cabinetDoor.txAddr, 8899),
      }

      list.push(item)
    }
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
   * @description: 销毁读写器
   * @param {string} address
   * @return {*}
   */
  async function destroyRfid(address: string) {
    return await window.JSBridge.rfid.destroy(address)
  }

  /**
   * @description:  发送开启命令
   * @param {string} address
   * @param {string} antennaIds
   * @return {*}
   */
  const sendOpenCommand = async (address: string, antennaIds: string) => {
    const antennaIdList = antennaIds.split(',').map(item => Number(item))
    return await window.JSBridge.rfid.sendOpenCommand(address, antennaIdList)
  }

  const sendCloseCommand = async (address: string) => {
    return await window.JSBridge.rfid.sendCloseCommand(address)
  }

  /**
   * @description: 打开读写器
   * @param {string} address
   * @param {string} antennaIds
   * @return {*}
   */
  const handleOpenRfid = async (address: string, antennaIds: string) => {
    await sendCloseCommand(address)
    await sendOpenCommand(address, antennaIds)
  }

  /**
   * @description: 关闭读写器,并销毁读写器
   * @param {string} address
   * @return {*}
   */
  const handleCloseRfid = async (address: string) => {
    await sendCloseCommand(address)
    await destroyRfid(address)
  }

  return {
    getRfidConnectState,
    initRfid,
    destroyRfid,
    handleOpenRfid,
    handleCloseRfid,
  }
}
