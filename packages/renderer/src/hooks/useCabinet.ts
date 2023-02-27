import { CHECK_TIME } from '@/config'
import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { saveCabinetData, saveCabinetDoorList } = store
  const { departmentList } = storeToRefs(store)

  /**
   * @description: 获取柜体信息
   * @return {*}
   */
  const getCabinetInfo = async () => {
    const data = await window.JSBridge.cabinet.getCabinetData()
    saveCabinetData(data)
  }

  /**
   * @description: 获取柜门信息
   * @return {*}
   */
  const getCabinetDoorInfo = async () => {
    const records = await window.JSBridge.cabinet.getCabinetDoorList()
    const list = []

    for (let index = 0; index < records.length; index++) {
      const item = records[index]

      list.push({
        ...item,
        name: departmentList.value.find(department => department.id === Number(item.binding_id))?.dept_name,
        isOpen: false,
        checkCountdown: CHECK_TIME
      })
    }

    saveCabinetDoorList(list)
  }

  return {
    getCabinetInfo,
    getCabinetDoorInfo
  }
}
