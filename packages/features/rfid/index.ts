import { Buffer } from 'buffer'
import { generateAntennaCommand, generateCRC16Code, getTIDByReportData, parseRFIDReportData } from './utils'
import { RfidSocket } from './socket'

export * from './socket'

interface InstanceMap {
  [k: string]: RfidSocket
}

const rfidInstanceMap: InstanceMap = {}

/**
 * @description: 初始化 rfid 连接
 * @param {string} address rfid 地址
 * @param {number} port rfid 端口
 * @return {*}
 */
export async function initRfidConnection(address: string, port: number) {
  if (rfidInstanceMap[address]) {
    delete rfidInstanceMap[address]
  }

  const socketConnetcion = new RfidSocket({ address, port })
  rfidInstanceMap[address] = socketConnetcion

  await socketConnetcion.connect()
}

/**
 * @description: 销毁 rfid 连接
 * @param {string} address
 * @return {*}
 */
export function destroyRfidConnection(address: string) {
  rfidInstanceMap?.[address]?.destroy()
  delete rfidInstanceMap?.[address]
}

/**
 * @description: 停止 rfid 读取
 * @param {string} address
 * @return {*}
 */
export function stopRifdReading(address: string) {
  rfidInstanceMap[address]?.write(Buffer.from('5A000102FF0000885A', 'hex'))
}

/**
 * @description: 开始 rfid 读取
 * @param {string} address rfid ip 地址
 * @param {number} antennaIds rfid 天线 id
 * @return {*}
 */
export function startRfidReading(address: string, antennaIds: number[]) {
  const COMMAND_HEADER = '5A'
  const commandBody = `000102100008${generateAntennaCommand(antennaIds)}01020006`
  const checkCode = generateCRC16Code(commandBody)
  const command = COMMAND_HEADER + commandBody + checkCode

  rfidInstanceMap[address]?.write(Buffer.from(command, 'hex'))
}

/**
 * @description: 获取 rfid 读取到的 tid 列表
 * @param {string} address
 * @return {*}
 */
export function getRfidTIDList(address: string) {
  const data = rfidInstanceMap?.[address]?.getData() || ''
  const reportData = parseRFIDReportData(data)
  const TIDList = [...new Set(reportData.map(item => getTIDByReportData(item)))]

  return TIDList
}
