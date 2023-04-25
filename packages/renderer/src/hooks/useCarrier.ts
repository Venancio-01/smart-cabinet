import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'

export default function () {
  const store = useStore()
  const { setMisPlaceCarrierData, setCarrierList} = store
  const { user, carrierList, misPlaceCarrierData } = storeToRefs(store)
  const checkStore = useCheckStore()
  const {
    setFirstCarrierRecord,
    setFirstMisPlaceCarrierRecord,
    setEndCarrierRecord,
    setEndMisPlaceCarrierRecord
  } = checkStore

  const getAllCarrierData = async () => {
    const carrierList = await window.JSBridge.carrier.getAllCarrierData()
    setCarrierList(carrierList)
    return carrierList
  }

  const getCarrierDataByCondition = async (condition: CarrierQueryProps) => {
    return await window.JSBridge.carrier.getCarrierDataByCondition({ ...condition })
  }

  /**
   * @description: 根据柜门 ID 获取载体数据
   * @param {number} cabinetId 柜门 ID
   * @return {*}
   */
  const getCarrierDataByCabinetId  = async (cabinetId: number) => {
    return await window.JSBridge.carrier.getCarrierDataByCabinetId (cabinetId)
  }

  /**
   * @description: 获取在位载体数量
   * @param {number} cabinetId 柜门 ID
   * @return {*}
   */
  const getInPlaceCarrierCount = async (cabinetId?: number) => {
    return await window.JSBridge.carrier.getInPlaceCarrierCount(cabinetId)
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
    const id = user.value?.id
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
    const carriers = await getAllCarrierData()
    const misPlaceCarriers = await getMisPlaceCarriers()
    setEndCarrierRecord(carriers)
    setEndMisPlaceCarrierRecord(misPlaceCarriers)
  }

  return {
    getCarrierDataByCondition,
    getAllCarrierData,
    getMisPlaceCarriers,
    updateCarrier,
    getCarrierDataByCabinetId ,
    getInPlaceCarrierCount,
    recordDataWhenCheckStart,
    recordDataWhenCheckEnd
  }
}
