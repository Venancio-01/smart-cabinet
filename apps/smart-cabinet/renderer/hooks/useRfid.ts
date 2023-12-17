import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setCabinetDoorList } = store
  const { cabinetDoorList } = storeToRefs(store)

  /**
   * @description: 获取读写器连接状态
   * @return {*}
   */
  const getRfidConnectionStatus = async () => {
    const promiseList = cabinetDoorList.value.reduce((acc, cur) => {
      if (cur.txAddr !== null) acc.push(window.electronApi.ipcRenderer.invoke('rfid:check-connection-status', cur.txAddr, 8899))
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
  }

  const handleInitRfidConnection = async (address: string) => {
    await window.electronApi.ipcRenderer.invoke('rfid:init-rfid-connection', address, 8899)
  }

  /**
   * @description: 打开读写器
   * @param {string} address
   * @param {string} antennaIds
   * @return {*}
   */
  const handleStartRfidReading = async (address: string, antennaIds: string) => {
    window.electronApi.ipcRenderer.send('rfid:stop-rfid-reading', address)

    const antennaIdList = antennaIds.split(',').map(item => Number(item))
    window.electronApi.ipcRenderer.send('rfid:start-rfid-reading', address, antennaIdList)
  }

  /**
   * @description: 关闭读写器,并销毁 socket
   * @param {string} address
   * @return {*}
   */
  const handleCloseRfid = async (address: string) => {
    window.electronApi.ipcRenderer.send('rfid:stop-rfid-reading', address)
    window.electronApi.ipcRenderer.send('rfid:destroy-rfid-connection', address)
  }

  return {
    getRfidConnectionStatus,
    handleInitRfidConnection,
    handleStartRfidReading,
    handleCloseRfid,
  }
}
