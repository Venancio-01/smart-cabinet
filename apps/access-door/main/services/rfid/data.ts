import { uniq, uniqBy } from 'lodash-es'
import { insertDoorRfidrecordList, selectDocDocumentList } from 'database'
import type { DocDocumentProps, DoorRfidrecord, DoorRfidregister } from 'database'
import { getCurrentEquipment } from '../access-door'
import { generateCRC16Code } from './utils'
import ProtocolMap from './protocol-map'
import type { Message, MessageQueue } from './message'
import type { AlarmStatus } from '~/enums'
import { AccessDirection } from '~/enums'

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
  const EPCLength = Number.parseInt(`0x${str.substring(4, 8)}`, 16) * 2
  const TIDLength = Number.parseInt(`0x${str.substring(8 + EPCLength + 16, 8 + EPCLength + 16 + 4)}`, 16) * 2

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
  const dataList = message.getMessages('ReceiveEPCReport').map((item) => item.content)

  const result = uniqBy(
    dataList.map((item) => getEPCAndTIDFromReportData(item)),
    'TID',
  )

  return result
}

/**
 * @description: 获取在数据库中登记的载体
 * @param {Message} messages
 * @return {*}
 */
export async function getInDatabaseCarrier(messages: Message[]) {
  const commandList = messages.map((item) => item.content)

  const TIDList = uniq(commandList.map((item) => getEPCAndTIDFromReportData(item).TID))
  const carriers = await selectDocDocumentList()
  const filteredCarriers = carriers?.filter((item) => TIDList.includes(item.docRfid || ''))

  return filteredCarriers
}

/**
 * @description: 新增 rfid 读取记录
 * @param {DocDocument} carriers
 * @param {DoorEquipment} equipment
 * @param {AccessDirection} direction
 * @return {*}
 */
export async function insertRfidRecordList(
  carriers: DocDocumentProps[],
  registrationRecords: DoorRfidregister[],
  direction: AccessDirection,
  isAlarm: AlarmStatus,
) {
  const equipment = await getCurrentEquipment()
  const registerRFIDList = registrationRecords.map((item) => item.docRfid)
  const list: Partial<DoorRfidrecord>[] = carriers.map((carrier) => {
    return {
      equipmentName: equipment.equipmentName,
      equipmentId: `${equipment.equipmentid}`,
      carrierId: `${carrier.docId}`,
      carrierName: carrier.docName,
      carrierRfid: carrier.docRfid,
      carrierDeptid: carrier.deptId,
      carrierDeptName: carrier?.department?.deptName,
      // 这里的 1 是进，0 是出
      type: direction === AccessDirection.IN ? '1' : direction === AccessDirection.OUT ? '2' : undefined,
      isAlarm: `${isAlarm}`,
      creatorTime: new Date(),
      isRegister: registerRFIDList.includes(carrier.docRfid) ? '1' : '0',
    }
  })

  insertDoorRfidrecordList(list)

  return list
}
