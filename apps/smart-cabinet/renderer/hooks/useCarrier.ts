import type { DocDocument } from 'database'
import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const {
    setMisPlaceCarrierData,
    setCarrierList,
    setFirstCarrierRecord,
    setFirstMisPlaceCarrierRecord,
    setEndCarrierRecord,
    setEndMisPlaceCarrierRecord,
  } = store
  const { user, carrierList, misPlaceCarrierData } = storeToRefs(store)

  const getCarriers = async () => {
    const carrierList = await window.JSBridge.carrier.selectDocDocumentList()
    setCarrierList(carrierList)
    return carrierList
  }

  const getCarriersByCondition = (condition: Partial<PaginationType & DocDocument>) => {
    return window.JSBridge.carrier.selectDocDocumentList({
      ...condition,
    })
  }

  /**
   * @description: 获取错放载体数据
   * @return {*}
   */
  const getMisPlaceCarriers = async () => {
    const records = await window.JSBridge.carrier.getMisPlaceCarriers()
    setMisPlaceCarrierData(records)
    return records
  }

  /**
   * @description: 根据 RFID 读取器读取到的数据更新载体状态
   * @return {*}
   */
  const updateCarrier = async (door: CabinetDoorProps) => {
    const id = user.value?.userId
    await window.JSBridge.carrier.updateCarrier({ ...door }, id)
  }

  /**
   * @description: 记录开始盘点时的载体数据
   * @return {*}
   */
  const recordDataWhenCheckStart = async () => {
    setFirstCarrierRecord(carrierList.value)
    setFirstMisPlaceCarrierRecord(misPlaceCarrierData.value)
  }

  /**
   * @description: 记录结束盘点时的载体数据
   * @return {*}
   */
  const recordDataWhenCheckEnd = async () => {
    const carriers = await getCarriers()
    const misPlaceCarriers = await getMisPlaceCarriers()
    setEndCarrierRecord(carriers)
    setEndMisPlaceCarrierRecord(misPlaceCarriers)
  }

  return {
    getCarriersByCondition,
    getCarriers,
    getMisPlaceCarriers,
    updateCarrier,
    recordDataWhenCheckStart,
    recordDataWhenCheckEnd,
  }
}
