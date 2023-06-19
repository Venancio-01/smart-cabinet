import { debounce, uniq, uniqBy } from 'lodash-es'
import type { DocDocument, DoorAccessRecords, DoorAlarmrecord, DoorEquipment, DoorRfidrecord, door_rfid_register } from 'database'
import { addAlarmRecord, addReadRecord, fetchRegistrationRecords, getCurrentAccessDoorDevice } from '../access-door'
import { getCarriers } from '../carrier'
import { getDepartmentById } from '../sys'
import { generateCRC16Code } from './utils'
import ProtocolMap from './protocol-map'
import type { Message, MessageQueue } from './message'
import { DETECTION_DURATION } from '@/config'
import type { AccessDirection } from '~/enums'

/**
 * @description: 校验接收到的数据
 * @param {string} data
 * @return {*}
 */
export function validateReceivedData(data: string) {
  const protocolControlWord = data.slice(2, 10)
  const dataLength = data.slice(10, 14)
  const body = data.slice(14, -4)
  const checkCode = data.slice(-4)

  const isValid = checkCode === generateCRC16Code(protocolControlWord + dataLength + body)

  return isValid
}

/**
 * @description: 解析 RFID 数据
 * @param {string} data
 * @return {*}
 */
export function parseData(data: string) {
  const protocolControlWord = data.slice(2, 10)
  const name = ProtocolMap[protocolControlWord.toLocaleUpperCase()]

  const result = {
    name: name || '未知',
    content: data,
    time: new Date().getTime(),
  }

  return result
}

/**
 * 解析 EPC 和 TID
 * @param data 数据字符串
 * @returns EPC 和 TID 对象
 */
export function getEPCAndTIDFromReportData(data: string): RFIDParseType {
  let str = data

  const PREFIX = '5a00011200'
  str = str.replace(PREFIX, '')
  const EPCLength = parseInt(`0x${str.substring(4, 8)}`, 16) * 2
  const TIDLength = parseInt(`0x${str.substring(8 + EPCLength + 16, 8 + EPCLength + 16 + 4)}`, 16) * 2

  const TID = str.substring(8 + EPCLength + 16 + 4, 8 + EPCLength + 16 + 4 + TIDLength)
  const EPC = str.substring(8, 8 + EPCLength)

  return {
    TID,
    EPC,
  }
}

/**
 * 获取解析后的 EPC 数据
 * @param antenna_address 天线地址
 * @returns 解析后的 EPC 数据数组
 */
export function parseTIDReportData(message: MessageQueue): RFIDParseType[] {
  const dataList = message.getMessages('ReceiveEPCReport').map(item => item.content)

  const result = uniqBy(
    dataList.map(item => getEPCAndTIDFromReportData(item)),
    'TID',
  )

  return result
}

/**
 * @description: 获取载体数据 - 防抖
 * @return {*}
 */
const fetchCarriers = debounce(
  async () => {
    const result = await getCarriers()
    return result
  },
  DETECTION_DURATION,
  {
    leading: true,
  },
)

/**
 * @description: 获取在库载体数据
 * @param {Message} messages
 * @return {*}
 */
export async function getInDatabaseCarrier(messages: Message[]): Promise<DocDocument[]> {
  const commandList = messages.map(item => item.content)

  const TIDList = uniq(commandList.map(item => getEPCAndTIDFromReportData(item).TID))
  const carriers = await fetchCarriers()
  const filteredCarriers = carriers?.filter(item => TIDList.includes(item.docRfid || ''))

  return filteredCarriers
}

/**
 * @description: 获取注册记录
 * @param {*} debounce
 * @return {*}
 */
export const handleFetchRegistrationRecords = debounce(async () => {
  const result = await fetchRegistrationRecords()
  return result
},
DETECTION_DURATION,
{
  leading: true,
})

/**
 * @description: 添加读取记录
 * @param {DocDocument} carriers
 * @param {DoorEquipment} equipment
 * @param {AccessDirection} direction
 * @return {*}
 */
export async function handleAddReadRecords(carriers: DocDocument[], registrationRecords: door_rfid_register[], accessRecord: DoorAccessRecords, direction: AccessDirection) {
  const equipment = await getCurrentAccessDoorDevice()

  if (equipment === null)
    return

  const dataList: Partial<DoorRfidrecord>[] = []
  const requestList: Promise<DoorRfidrecord>[] = []
  const registerRFIDList = registrationRecords.map(item => item.docRfid)

  for (let index = 0; index < carriers.length; index++) {
    const carrier = carriers[index]
    const departmentId = carrier.binding_dept_id
    const department = departmentId ? await getDepartmentById(departmentId) : null

    const data: Partial<DoorRfidrecord> = {
      accessId: `${accessRecord.accessId}`,
      equipmentName: equipment.equipmentName,
      equipmentId: `${equipment.equipmentId}`,
      carrier_id: `${carrier.doc_id}`,
      carrierName: carrier.doc_name,
      carrier_rfid: carrier.docRfid,
      carrier_deptid: carrier.binding_dept_id ? String(carrier.binding_dept_id) : null,
      carrier_deptname: department?.deptName,
      type: `${direction}`,
      is_alarm: registerRFIDList.includes(carrier.docRfid) ? '0' : '1',
      createTime: new Date(),
      isRegister: registerRFIDList.includes(carrier.docRfid) ? '1' : '0',
    }

    requestList.push(addReadRecord(data))
  }

  dataList.push(...(await Promise.all(requestList)))

  return dataList
}

/**
 * @description: 添加报警记录
 * @param {DocDocument} carriers
 * @param {DoorEquipment} equipment
 * @param {DoorAccessRecords} accessRecord
 * @return {*}
 */
export async function handleAddAlarmRecord(carriers: DocDocument[], equipment: DoorEquipment, accessRecord: DoorAccessRecords) {
  const dataList: Partial<DoorAlarmrecord>[] = []
  for (let index = 0; index < carriers.length; index++) {
    const element = carriers[index]

    const departmentId = element.binding_dept_id
    const department = departmentId ? await getDepartmentById(departmentId) : null

    const data: Partial<DoorAlarmrecord> = {
      accessId: `${accessRecord.accessId}`,
      equipmentId: `${equipment.equipmentId}`,
      equipmentName: equipment.equipmentName,
      carrier_id: `${element.doc_id}`,
      carrier_rfid: element.docRfid,
      carrierName: element.doc_name,
      carrier_deptid: element.binding_dept_id ? String(element.binding_dept_id) : null,
      carrier_deptname: department?.deptName,
      is_operation: '0',
      remark: '',
      createTime: new Date(),
    }
    dataList.push(data)

    addAlarmRecord(data)
  }

  return dataList
}
