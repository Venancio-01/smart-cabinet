import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setCabinetDoorList } = store

  /**
   * @description: 获取柜门信息
   * @return {*}
   */
  const getCabinetDoorInfo = async () => {
    const result = await window.JSBridge.cabinet.selectRfidCabinetDoorList()

    setCabinetDoorList(result)
  }

  const initCabinetData = async () => {
    return Promise.all([getCabinetDoorInfo()])
  }

  return {
    getCabinetDoorInfo,
    initCabinetData,
  }
}
