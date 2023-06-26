import {
  insertRfidTipsAlarmRecord,
  selectDocDocumentList,
  selectDocDocumentListWithPage,
  selectRfidTipsAlarmRecordList,
  selectRfidTipsAlarmRecordListCount,
  updateDocDocument,
  updateRfidTipsAlarmRecord,
} from 'database'
import type { RfidCabinetdoor, RfidTipsAlarmRecord } from 'database'
import { getReportData } from './rfid'
import { currentCabinet, getCurrentCabinet } from './cabinet'
import { AlarmContentType, AlarmObjectType, AlarmType, OperationStatus } from '~/enums'

export enum BorrowedState {
  Returned,
  Borrowed,
}

async function getMisPlaceCarrierList() {
  const cabinetId = (await getCurrentCabinet())?.id
  return selectRfidTipsAlarmRecordList({
    isOperation: OperationStatus.Unoperated,
    doorid: cabinetId,
  })
}

async function updateCarrier(cabinetDoor: RfidCabinetdoor, userId?: bigint) {
  if (!cabinetDoor.txAddr) return

  const TIDList = getReportData(cabinetDoor.txAddr)
  console.log(cabinetDoor.id, '柜门id')
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList:', TIDList)
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList.length:', TIDList.length)

  const documents = await selectDocDocumentList()

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]

    // 如果不是本柜门文件
    if (doc.cabinetDoorId !== cabinetDoor.id) {
      const misplacedDocumentCount = await selectRfidTipsAlarmRecordListCount({
        doorid: cabinetDoor.id,
        rfid: doc.docRfid,
      })

      const isWarningDocument = misplacedDocumentCount !== 0
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
        deptName: doc.department.deptName,
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
      const isDetectedDocument = TIDList.includes(doc.docRfid)
      if (!isDetectedDocument) continue

      const updatedDocPStatus = doc.docPStatus === BorrowedState.Borrowed ? BorrowedState.Returned : BorrowedState.Borrowed
      await updateDocDocument(
        {
          docId: doc.docId,
        },
        {
          docPStatus: updatedDocPStatus,
          docLastUserId: Number(userId),
          docLastTime: new Date(),
        },
      )
    }
  }

  const misPlaceDocuments = await getMisPlaceCarrierList()
  for (let i = 0; i < misPlaceDocuments.length; i++) {
    const doc = misPlaceDocuments[i]
    if (!doc.operationid) continue

    if (!TIDList.includes(doc.operationid)) {
      await updateRfidTipsAlarmRecord(
        {
          operationid: doc.operationid,
        },
        {
          isOperation: OperationStatus.Operated,
        },
      )
    }
  }
}

const carrierService = {
  name: 'carrier' as const,
  fns: {
    selectDocDocumentList,
    selectDocDocumentListWithPage,
    getMisPlaceCarrierList,
    updateCarrier,
  },
}

export default carrierService
