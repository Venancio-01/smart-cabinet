import type { RfidCabinetdoorProps } from '@smart-cabinet/database'
import { useGlobalState } from '@/store'

import { AlarmContentType, OperationStatus } from '~/enums'

const { setMisPlaceCarrierData, setCarrierList, setInitialCarrierList } = useGlobalState()
const { user, carrierList, currentCabinet } = useGlobalState()
/**
 * @description: 获取本部门载体数据
 * @return {*}
 */
export async function getCarrierList() {
  const carrierList = await window.electronApi.ipcRenderer.invoke('carrier:select-doc-document-list', currentCabinet.value?.deptId)
  setCarrierList(carrierList)
}

/**
 * @description: 获取本柜错放载体数据
 * @return {*}
 */
export async function getMisPlaceCarrierList() {
  const records = await window.electronApi.ipcRenderer.invoke('carrier:select-rfid-tips-alarm-record-list', {
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
export async function updateCarrier(door: RfidCabinetdoorProps) {
  const cabinetDoor = toRaw({
    ...door,
    cabinet: toRaw(door.cabinet),
  })
  const id = user.value?.userId

  await window.electronApi.ipcRenderer.invoke('carrier:update-carrier', cabinetDoor, id)
}

/**
 * @description: 记录开始盘点时的载体数据
 * @return {*}
 */
export async function recordDataWhenCheckStart() {
  setInitialCarrierList(carrierList.value)
}

/**
 * @description: 初始化载体相关数据
 * @return {*}
 */
export function initCarrierData() {
  return Promise.all([getCarrierList(), getMisPlaceCarrierList()])
}
