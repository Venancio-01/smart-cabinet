import { binaryToHex, generateBinaryString, generateCRC16Code, getTIDByReportData, parseRFIDReportData } from '@/utils'
import TcpSocket from '@/utils/socket'

type InstanceMap = {
  [k in string]: TcpSocket
}

const instanceMap: InstanceMap = {}

const generateAntennaCommand = (antennaIds: number[]) => {
  const binary = generateBinaryString(antennaIds)
  const command = binaryToHex(binary)
  return command
}

const rfidService = {
  name: 'rfid',
  fns: {
    /**
     * @description: 初始化 socket 连接
     * @return {*}
     */
    async init(address: string, port: number) {
      if (instanceMap[address]) return true

      instanceMap[address] = new TcpSocket(address, port)

      try {
        await instanceMap[address].init()
        return true
      } catch (e) {
        console.log(e, 'socket 连接失败')
        return false
      }
    },

    /**
     * @description: 关闭 socket 连接
     * @return {*}
     */
    destroy(address: string) {
      if (!instanceMap[address]) return

      instanceMap[address].destroy()
      instanceMap[address] = null
    },

    /**
     * @description: 发送关闭命令
     * @return {*}
     */
    sendCloseCommand(address: string) {
      if (!instanceMap[address]) return

      instanceMap[address].write(Buffer.from('5A000102FF0000885A', 'hex'))
    },

    /**
     * @description: 发送开启命令
     * @param {number[]} antennaIds 天线 id
     * @return {*}
     */
    sendOpenCommand(address: string, antennaIds: number[]) {
      if (!instanceMap[address]) return

      const COMMAND_HEADER = '5A'
      const commandBody = `000102100008${generateAntennaCommand(antennaIds)}01020006`
      const checkCode = generateCRC16Code(commandBody)
      const command = COMMAND_HEADER + commandBody + checkCode

      instanceMap[address].write(Buffer.from(command, 'hex'))
    },

    /**
     * @description: 获取主动上报的读卡数据
     * @return {*}
     */
    getReportData(address: string) {
      if (!instanceMap[address]) return

      const data = instanceMap[address].getData()
      const reportData = parseRFIDReportData(data)
      const TIDList = [...new Set(reportData.map(item => getTIDByReportData(item)))]

      return TIDList
    }
  }
}

export default rfidService
