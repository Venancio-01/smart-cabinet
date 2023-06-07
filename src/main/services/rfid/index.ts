import { Buffer } from 'buffer'
import { generateAntennaCommand, generateCRC16Code, getTIDByReportData, parseRFIDReportData } from './utils'
import Socket from './socket'

type InstanceMap = {
  [k in string]: Socket
}

const instanceMap: InstanceMap = {}

async function init(address: string, port: number) {
  if (instanceMap[address])
    return true

  instanceMap[address] = new Socket({ address, port })
  try {
    await instanceMap[address].init()
    return true
  }
  catch (e) {
    return false
  }
}

function destroy(address: string) {
  if (!instanceMap[address])
    return

  instanceMap[address].destroy()
  instanceMap[address] = null
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
  if (!instanceMap[address]) {
    console.log('socket 连接不存在')
    return []
  }

  const data = instanceMap[address].getData()
  const reportData = parseRFIDReportData(data)
  const TIDList = [...new Set(reportData.map(item => getTIDByReportData(item)))]

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
