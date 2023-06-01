import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setRfidIsConnected } = store
  const { cabinetDoorList } = storeToRefs(store)

  /**
   * @description: 获取读写器连接状态
   * @return {*}
   */
  const getRfidConnectState = async () => {
    const result = []
    for (let i = 0; i < cabinetDoorList.value.length; i++) {
      const { antenna_address, antenna_port } = cabinetDoorList.value[i]
      if (antenna_address === null)
        continue
      result.push(await window.JSBridge.rfid.init(antenna_address, antenna_port))
      await destroyRfid(antenna_address)
    }

    const isConnected = result.every(Boolean)
    setRfidIsConnected(isConnected)
    return isConnected
  }

  /**
   * @description: 初始化读写器
   * @param {string} address
   * @param {number} port
   * @return {*}
   */
  const initRfid = async (address: string, port: number) => {
    const isConnected = await window.JSBridge.rfid.init(address, port)
    setRfidIsConnected(isConnected)
    return isConnected
  }

  /**
   * @description: 销毁读写器
   * @param {string} address
   * @return {*}
   */
  const destroyRfid = async (address: string) => {
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
