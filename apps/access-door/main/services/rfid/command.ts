import { DETECTION_DURATION } from 'utils/config/main'
import { generateAntennaCommand, generateCommand } from './utils'

/**
 * @description: 连接状态确认
 * @param {number} count 种子
 * @return {*}
 */
export function generateCheckConnectionStatusCommand(count: number) {
  const protocolControlWord = '00011112'
  const dataLength = '0004'

  const body = count.toString(16).padStart(8, '0')

  const str = protocolControlWord + dataLength + body

  return generateCommand(str)
}

/**
 * @description: 停止读写器的 RFID 操作，并使读写器进入空闲状态
 * @return {*}
 */
export function generateStopCommand() {
  const protocolControlWord = '000102FF'
  const dataLength = '0000'

  const str = protocolControlWord + dataLength

  return generateCommand(str)
}

/**
 * @description: 读 EPC
 * @param {number} antennaIds 天线id，[1,2,3,4]格式
 * @return {*}
 */
export function generateReadEPCCommand(antennaIds: number[]) {
  const protocolControlWord = '00010210'
  const dataLength = '0008'

  const body = `${generateAntennaCommand(antennaIds)}01020006`

  const str = protocolControlWord + dataLength + body

  return generateCommand(str)
}

/**
 * @description: 设置 GPO
 * @param {1|2|3|4} index
 * @param {boolean} status
 * @return {*}
 */
export function generateSetGPOCommand(index: GPOIndexType, status: boolean) {
  const protocolControlWord = '00010109'
  const dataLength = '0002'

  const GPOIndex = index.toString().padStart(2, '0')

  const GPOStatus = status ? '01' : '00'

  const body = `${GPOIndex}${GPOStatus}`

  const str = protocolControlWord + dataLength + body

  return generateCommand(str)
}

/**
 * @description: 设置 GPI 触发命令
 * @param {string} triggerCommand 触发命令
 * @return {*}
 */
export function generteSetGPITriggerCommand(GPIIndex: GPIIndexType, triggerCommand: string) {
  const protocolControlWord = '0001010B'

  // 触发 GPI 端口号
  const GPIIndexStr = GPIIndex.toString().padStart(2, '0')

  // 触发开始条件, 2 - 高电平触发
  const triggerStartCondition = '02'

  // 触发命令的长度
  const triggerCommandLength = (triggerCommand.length / 2).toString(16).padStart(4, '0')

  // 触发停止条件, 6 - 延时停止
  const triggerStopCondition = '06'

  // 停止延时时间， mid = 01
  const duration = `01${(DETECTION_DURATION / 10).toString(16).padStart(4, '0')}`

  // 完整命令
  const body = `${GPIIndexStr}${triggerStartCondition}${triggerCommandLength}${triggerCommand}${triggerStopCondition}${duration}`

  // 数据长度
  const dataLength = (body.length / 2).toString(16).padStart(4, '0')

  const str = protocolControlWord + dataLength + body

  return generateCommand(str)
}
