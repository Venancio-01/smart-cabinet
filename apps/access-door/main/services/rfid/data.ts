import { debounce, uniq, uniqBy } from 'lodash-es'
import { insertDoorRfidrecordList, selectDocDocumentList, selectDoorRfidregisterList } from 'database'
import type { DocDocumentProps, DoorAlarmrecord, DoorEquipment, DoorRfidrecord, DoorRfidregister } from 'database'
import dayjs from 'dayjs'
import { generateCRC16Code } from './utils'
import ProtocolMap from './protocol-map'
import type { Message, MessageQueue } from './message'
import { AccessDirection, ApprovalStatus } from '~/enums'

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
  const dataList = message.getMessages('ReceiveEPCReport').map(item => item.content)

  const result = uniqBy(
    dataList.map(item => getEPCAndTIDFromReportData(item)),
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
  const commandList = messages.map(item => item.content)

  const TIDList = uniq(commandList.map(item => getEPCAndTIDFromReportData(item).TID))
  const carriers = await selectDocDocumentList()
  const filteredCarriers = carriers?.filter(item => TIDList.includes(item.docRfid || ''))

  return filteredCarriers
}

/**
 * @description: 新增 RFID 读取记录
 * @param {DocDocument} carriers
 * @param {DoorEquipment} equipment
 * @param {AccessDirection} direction
 * @return {*}
 */
export async function insertRfidRecordList(
  equipment: DoorEquipment,
  carriers: DocDocumentProps[],
  registrationRecords: DoorRfidregister[],
  direction: AccessDirection,
  alarmRecordList: Partial<DoorAlarmrecord>[],
) {
  const registerRFIDList = registrationRecords.map(item => item.docRfid)
  const list: Partial<DoorRfidrecord>[] = carriers.map((carrier) => {
    const isAlarm = alarmRecordList.some(item => item.carrierRfid === carrier.docRfid)
    return {
      equipmentName: equipment?.equipmentName,
      equipmentId: `${equipment?.equipmentid}`,
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

/**
 * @description: 防抖查询 RFID 登记记录
 * @param {*}
 * @return {*}
 */

let result: DoorRfidregister[] = []
export async function debouncedSelectRfidRegisterRecord() {
  const fn = debounce(selectDoorRfidregisterList, 3000, {
    leading: true,
  })
  result = await fn()
  return result
}

/**
 * @description: 筛选登记异常载体
 * @param {DocDocumentProps} carrierList
 * @param {DoorRfidregister} registerRecord
 * @return {*}
 */
export function filterAbnormalCarrier(carrierList: DocDocumentProps[], registerRecord: DoorRfidregister[]) {
  // 未登记载体
  const registerRfidList = registerRecord.map(item => item.docRfid)
  const unregisteredCarrierList = carrierList.filter(item => !registerRfidList.includes(item.docRfid))

  // 审批未通过载体
  const approvalFailedRegisterRfidRecord = registerRecord
    .filter(item => item.state === ApprovalStatus.PENDING || item.state === ApprovalStatus.REJECTED)
    .map(item => item.docRfid)
  const approvalFailedCarrierList = carrierList.filter(item => approvalFailedRegisterRfidRecord.includes(item.docRfid))

  // 审批通过但超出规定时间的载体
  const now = dayjs()

  const approvalPassedRegisterRecord = registerRecord.filter(item => item.state === ApprovalStatus.APPROVED)
  const expiredCarrier = carrierList.reduce<DocDocumentProps[]>((acc, cur) => {
    approvalPassedRegisterRecord.forEach((item) => {
      if (item.docRfid === cur.docRfid && dayjs(item.startTime).isBefore(now) && dayjs(item.endTime).isAfter(now)) {
        acc.push(cur)
      }
    })
    return acc
  }, [])

  return {
    unregisteredCarrierList,
    approvalFailedCarrierList,
    expiredCarrier,
  }
}
