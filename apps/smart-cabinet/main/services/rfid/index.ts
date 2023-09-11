import { Buffer } from 'buffer'
import { generateAntennaCommand, generateCRC16Code, getTIDByReportData, parseRFIDReportData } from './utils'
import Socket from './socket'

interface InstanceMap {
  [k: string]: Socket
}

const instanceMap: InstanceMap = {}

/**
 * @description: 初始化 socket 连接
 * @param {string} address
 * @param {number} port
 * @return {*}
 */
async function init(address: string, port: number) {
  if (instanceMap[address]) return true

  instanceMap[address] = new Socket({ address, port })
  return instanceMap[address].init()
}

function destroy(address: string) {
  instanceMap?.[address]?.destroy()
  delete instanceMap?.[address]
}

function sendCloseCommand(address: string) {
  instanceMap[address]?.write(Buffer.from('5A000102FF0000885A', 'hex'))
}

function sendOpenCommand(address: string, antennaIds: number[]) {
  const COMMAND_HEADER = '5A'
  const commandBody = `000102100008${generateAntennaCommand(antennaIds)}01020006`
  const checkCode = generateCRC16Code(commandBody)
  const command = COMMAND_HEADER + commandBody + checkCode

  instanceMap[address]?.write(Buffer.from(command, 'hex'))
}

export function getReportData(address: string) {
  const data = instanceMap?.[address]?.getData() || ''
  const reportData = parseRFIDReportData(data)
  const TIDList = [...new Set(reportData.map((item) => getTIDByReportData(item)))]

  return TIDList
}

const rfidService = {
  name: 'rfid' as const,
  fns: {
    init,
    destroy,
    sendCloseCommand,
    sendOpenCommand,
    getReportData,
  },
}

export default rfidService
