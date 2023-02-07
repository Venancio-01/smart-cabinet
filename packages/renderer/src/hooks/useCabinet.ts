import { CHECK_TIME } from '@/config'
import { useStore } from '@/store'
import useDocument from './useDocument'

export default function () {
  const store = useStore()
  const { saveCabinetData, saveCabinetDoorList } = store
  const { cabinetDoorList, departmentList } = storeToRefs(store)
  const { getDocumentByCabinetId, getInPlaceDocumentCountByCabinetId } = useDocument()

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

      const totalDocument = await getDocumentByCabinetId(item.ID)
      const totalDocumentCount = totalDocument.length
      const inPlaceDocumentCount = await getInPlaceDocumentCountByCabinetId(item.ID)

      list.push({
        ...item,
        name: departmentList.value.find(department => department.DEPT_ID === Number(item.BINDING_ID))?.DEPT_NAME,
        totalDocumentCount,
        inPlaceDocumentCount,
        isSelected: false,
        isOpen: false,
        checkCountDown: CHECK_TIME
      })
    }

    saveCabinetDoorList(list)
  }

  return {
    getCabinetInfo,
    getCabinetDoorInfo
  }
}
