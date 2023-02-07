import {
  addMisPlacedDocument,
  queryMisplacedDocument,
  queryMisplacedDocumentCountByTid,
  updateDocStatusByID,
  updateMisPlaceDocument
} from '@/database/methods/document'
import { binaryToHex, generateBinaryString, generateCurrentTime, getTIDByReportData, parseRFIDReportData } from '@/utils'
import TcpSocket from '@/utils/socket'
import { rfid_cabinet_door } from '@prisma/client'
import documentService from './document-service'
import { CRC_SDK_PATH } from '@/config/finger'
import { UcharType } from './finger-service/types'
const { Library } = require('ffi-napi')

const crcSDK = Library(CRC_SDK_PATH, {
  CRC16_CCITT: ['int', [UcharType, 'int']]
})

let instance: TcpSocket | null = null

const generateAntennaCommand = (antennaIds: number[]) => {
  const binary = generateBinaryString(antennaIds)
  const command = binaryToHex(binary)
  return command
}

const rfidService = {
  name: 'rfid' as 'rfid',
  fns: {
    /**
     * @description: 初始化 socket 连接
     * @return {*}
     */
    async init(address: string, port: number) {
      instance = new TcpSocket(address, port)
      try {
        await instance.init()
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
    destroy() {
      if (!instance) return

      instance.destroy()
      instance = null
    },

    /**
     * @description: 发送关闭命令
     * @return {*}
     */
    sendCloseCommand() {
      if (!instance) return

      instance.write(Buffer.from('5A000102FF0000885A', 'hex'))
    },

    /**
     * @description: 发送开启命令
     * @param {number[]} antennaIds 天线 id
     * @return {*}
     */
    sendOpenCommand(antennaIds: number[]) {
      if (!instance) return

      const COMMAND_HEADER = '5A'
      const commandBody = `000102100008${generateAntennaCommand(antennaIds)}01020006`
      const commandBodyBuf = Buffer.from(commandBody, 'hex')
      const checkCode = crcSDK.CRC16_CCITT(commandBodyBuf, commandBodyBuf.length).toString(16)
      const command = COMMAND_HEADER + commandBody + checkCode

      console.log('🚀 ~ file: rfid-service.ts:82 ~ sendOpenCommand ~ command', command)
      instance.write(Buffer.from(command, 'hex'))
    },

    /**
     * @description: 获取主动上报的读卡数据
     * @return {*}
     */
    getReportData() {
      if (!instance) return

      const data = instance.getData()
      const reportData = parseRFIDReportData(data)
      const TIDList = [...new Set(reportData.map(item => getTIDByReportData(item)))]

      return TIDList
    },

    /**
     * @description: 盘点之后更新文件状态
     * @return {*}
     */
    async updateDocumentStateAfterCheck(cabinetDoorData: rfid_cabinet_door, userId?: number) {
      const TIDList = rfidService.fns.getReportData()
      console.log(cabinetDoorData.ID, 'ID')
      console.log('🚀 ~ file: rfid-service.ts:105 ~ updateDocumentStateAfterCheck ~ TIDList', TIDList)
      const documents = await documentService.fns.getAllDocumentData()
      const misPlaceDocuments = await queryMisplacedDocument()

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]

        // 如果不是本柜门文件
        if (doc.CABINET_DOOR_ID !== cabinetDoorData.ID) {
          const isWarningDocument = (await queryMisplacedDocumentCountByTid(doc.DOC_RFID)) !== 0
          if (isWarningDocument) continue

          const data = {
            CABINETDOORID: String(cabinetDoorData.ID),
            CABINETID: String(cabinetDoorData.CABINETID),
            CONTENT: `文件[${doc.DOC_NAME}]错放`,
            DATETIME: generateCurrentTime(),
            OPERATIONID: TIDList.includes(doc.DOC_RFID) ? doc.DOC_RFID : '0',
            TYPE: '1',
            USERID: userId || null
          }
          await addMisPlacedDocument(data)
        } else {
          // 归还
          if (TIDList.includes(doc.DOC_RFID) && doc.DOC_REISSUENUMBER == 1) {
            await updateDocStatusByID(doc.DOC_ID, 0)
          }
          // 借出
          else if (!TIDList.includes(doc.DOC_RFID) && doc.DOC_REISSUENUMBER == 0) {
            await updateDocStatusByID(doc.DOC_ID, 1)
          }
        }
      }

      // 清除错放记录
      for (let i = 0; i < misPlaceDocuments.length; i++) {
        const doc = misPlaceDocuments[i]
        if (!TIDList.includes(doc.OPERATIONID)) {
          await updateMisPlaceDocument(doc.OPERATIONID)
        }
      }
    }
  }
}

export default rfidService
