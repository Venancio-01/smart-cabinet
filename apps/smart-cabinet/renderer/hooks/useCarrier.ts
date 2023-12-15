import type { RfidCabinetdoorProps } from '@smart-cabinet/database'
import { useStore } from '@/store'
import { AlarmContentType, OperationStatus } from '~/enums'

export default function () {
  const store = useStore()
  const { setMisPlaceCarrierData, setCarrierList, setInitialCarrierList } = store
  const { user, carrierList, currentCabinet } = storeToRefs(store)

  /**
   * @description: 获取本部门载体数据
   * @return {*}
   */
  const getCarrierList = async () => {
    const carrierList = await window.JSBridge.carrier.selectDocDocumentList({
      deptId: currentCabinet.value?.deptId,
    })
    console.log('🚀 ~ file: useCarrier.ts:18 ~ getCarrierList ~ carrierList:', carrierList)
    setCarrierList(carrierList)
  }

  /**
   * @description: 获取本柜错放载体数据
   * @return {*}
   */
  const getMisPlaceCarrierList = async () => {
    const records = await window.JSBridge.carrier.selectRfidTipsAlarmRecordList({
      isOperation: OperationStatus.Unoperated,
      contentType: AlarmContentType.IncorrectLocation,
      cadinetId: currentCabinet.value?.id,
    })
    setMisPlaceCarrierData(records)
  }

  /**
   * @description: 根据 RFID 读取器读取到的数据更新载体状态
   * @return {*}
   */
  const updateCarrier = async (door: RfidCabinetdoorProps) => {
    const cabinetDoor = toRaw({
      ...door,
      cabinet: toRaw(door.cabinet),
    })
    const id = user.value?.userId
    await window.JSBridge.carrier.updateCarrier(cabinetDoor, id)
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
  function initCarrierData() {
    return Promise.all([getCarrierList(), getMisPlaceCarrierList()])
  }

  return {
    initCarrierData,
    getCarrierList,
    getMisPlaceCarrierList,
    updateCarrier,
    recordDataWhenCheckStart,
  }
}
