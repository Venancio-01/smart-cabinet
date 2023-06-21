import { insertCheckResult, insertDocCheckLog, insertRfidTipsAlarmRecord, prisma, selectDocDocumentList } from 'database'
import type { DocDocument, RfidSwitchRecord, RfidTipsAlarmRecord } from 'database'
import { getReportData } from './rfid'
import { currentCabinet } from './cabinet'
import { AlarmContentType, AlarmObjectType, AlarmType, OperationStatus } from '~/enums'

export enum BorrowedState {
  Returned,
  Borrowed,
}

/**
 * @description: 根据 tid 获取错放文件数量
 * @param {number} tid
 * @return {*}
 */
function queryMisplacedDocumentCount(cabinetDoorId?: string, rfid?: string) {
  return prisma.rfidSwitchRecord.count({
    where: {
      operationId: rfid || undefined,
      cabinetDoorId: cabinetDoorId || undefined,
    },
  })
}

/**
 * @description: 根据文件 id 修改状态
 * @param {number} id
 * @param {number} state
 * @return {*}
 */
function updateDocStatusByID(id: bigint, state: number, userId: bigint) {
  return prisma.docDocument.updateMany({
    where: {
      docId: id,
    },
    data: {
      docLastUserId: Number(userId),
      docPStatus: state,
      docLastTime: new Date(),
    },
  })
}

/**
 * @description: 更新错放文件记录
 * @param {string} tid
 * @return {*}
 */
function updateMisPlaceDocument(id: string) {
  return prisma.rfidSwitchRecord.updateMany({
    where: {
      operationId: id,
    },
    data: {
      operationId: '0',
    },
  })
}

async function getCarriersByCondition(condition: CarrierQueryProps): Promise<{
  data: DocDocument[]
  total: number
}> {
  const query: Partial<{ [key in keyof DocDocument]: any }> = {
    cabinetDoorId: condition.cabinetId ? Number(condition.cabinetId) : undefined,
    docName: {
      contains: condition.title,
    },
    docPStatus: condition.state ?? undefined,
    deptId: condition.departmentId ? Number(condition.departmentId) : undefined,
  }

  if (condition.state === 2) {
    const misPlaceDocuments = await getMisPlaceCarriers()
    const rfids = misPlaceDocuments.map((item) => item.operationId)
    query.docPStatus = 1
    query.docRfid = { in: rfids }
  } else if (condition.state === 1) {
    const misPlaceDocuments = await getMisPlaceCarriers()
    const rfids = misPlaceDocuments.map((item) => item.operationId)
    query.docPStatus = 1
    query.docRfid = { notIn: rfids }
  }

  const [data, total] = await Promise.all([
    prisma.docDocument.findMany({
      skip: (condition.page - 1) * condition.size,
      take: condition.size,
      where: query,
    }),
    prisma.docDocument.count({
      where: query,
    }),
  ])

  return {
    data,
    total,
  }
}

function getMisPlaceCarriers(cabinetDoorID?: string): Promise<RfidSwitchRecord[]> {
  return prisma.rfidSwitchRecord.findMany({
    where: {
      operationId: {
        not: '0',
      },
      cabinetDoorId: cabinetDoorID,
    },
  })
}

async function updateCarrier(cabinetDoor: CabinetDoorProps, userId?: bigint) {
  if (!cabinetDoor.txAddr) return

  const TIDList = getReportData(cabinetDoor.txAddr)
  console.log(cabinetDoor.id, '柜门id')
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList:', TIDList)
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList.length:', TIDList.length)

  const documents = await selectDocDocumentList()

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]
    if (!doc.docRfid || !userId) continue

    // 如果不是本柜门文件
    if (doc.cabinetDoorId !== cabinetDoor.id) {
      const isWarningDocument = (await queryMisplacedDocumentCount(String(cabinetDoor.id), doc.docRfid)) !== 0
      if (isWarningDocument) continue

      const data: Partial<RfidTipsAlarmRecord> = {
        alarmType: `${AlarmObjectType.Carrier}`,
        type: AlarmType.Alarm,
        userId: Number(userId),
        operationid: '',
        createDate: new Date(),
        handleUserId: Number(userId),
        handleOperationid: '',
        handleDate: new Date(),
        cadinetId: currentCabinet?.id,
        doorid: cabinetDoor.id,
        content: `${doc.docName}存放位置错误`,
        contentType: AlarmContentType.IncorrectLocation,
        rfid: doc.docRfid,
        groupid: doc.userId,
        docId: doc.docId,
        docCarName: doc.docName,
        deptName: '',
        carUserName: '',
        cabName: '',
        cabdoorName: '',
        opeUserName: '',
        cabdoorUserName: '',
        cabdoorDeptName: '',
        isOperation: OperationStatus.Unoperated,
      }
      await insertRfidTipsAlarmRecord(data)
    } else {
      const isDocumentDetected = TIDList.includes(doc.docRfid)

      // 归还
      if (isDocumentDetected && doc.docPStatus === BorrowedState.Borrowed) await updateDocStatusByID(doc.docId, 0, userId)
      // 领用
      else if (!isDocumentDetected && doc.docPStatus === BorrowedState.Returned) await updateDocStatusByID(doc.docId, 1, userId)
    }
  }

  const misPlaceDocuments = await getMisPlaceCarriers()
  for (let i = 0; i < misPlaceDocuments.length; i++) {
    const doc = misPlaceDocuments[i]
    if (!doc.operationId) continue

    if (!TIDList.includes(doc.operationId)) await updateMisPlaceDocument(doc.operationId)
  }
}

const carrierService = {
  name: 'carrier' as const,
  fns: {
    selectDocDocumentList,
    getCarriersByCondition,
    getMisPlaceCarriers,
    updateCarrier,
    insertDocCheckLog,
    insertCheckResult,
  },
}

export default carrierService
