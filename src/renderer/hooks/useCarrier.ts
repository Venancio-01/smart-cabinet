import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'

export default function () {
  const store = useStore()
  const { setMisPlaceCarrierData, setCarrierList } = store
  const { user, carrierList, misPlaceCarrierData } = storeToRefs(store)
  const checkStore = useCheckStore()
  const {
    setFirstCarrierRecord,
    setFirstMisPlaceCarrierRecord,
    setEndCarrierRecord,
    setEndMisPlaceCarrierRecord,
  } = checkStore

  const getCarriers = async () => {
    const carrierList = await window.JSBridge.carrier.getCarriers()
    setCarrierList(carrierList)
    return carrierList
  }

  const getCarriersByCondition = async (condition: CarrierQueryProps) => {
    return await window.JSBridge.carrier.getCarriersByCondition({ ...condition })
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
    const id = user.value?.user_id
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
