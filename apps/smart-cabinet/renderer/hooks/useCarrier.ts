import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setMisPlaceCarrierData, setCarrierList, setInitialCarrierList } = store
  const { user, carrierList } = storeToRefs(store)

  /**
   * @description: 获取载体数据
   * @return {*}
   */
  const getCarrierList = async () => {
    const carrierList = await window.JSBridge.carrier.selectDocDocumentList()
    setCarrierList(carrierList)
  }

  /**
   * @description: 获取错放载体数据
   * @return {*}
   */
  const getMisPlaceCarrierList = async () => {
    const records = await window.JSBridge.carrier.getMisPlaceCarrierList()
    setMisPlaceCarrierData(records)
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
    setInitialCarrierList(carrierList.value)
  }

  /**
   * @description: 初始化载体相关数据
   * @return {*}
   */
  function init() {
    return Promise.all([getCarrierList(), getMisPlaceCarrierList()])
  }

  return {
    init,
    getCarrierList,
    getMisPlaceCarrierList,
    updateCarrier,
    recordDataWhenCheckStart,
  }
}
