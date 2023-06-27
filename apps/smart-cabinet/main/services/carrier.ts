import {
  insertRfidTipsAlarmRecord,
  selectDocDocumentList,
  selectDocDocumentListWithPage,
  selectRfidTipsAlarmRecordList,
  selectRfidTipsAlarmRecordListCount,
  updateDocDocument,
  updateRfidTipsAlarmRecord,
} from 'database'
import type { RfidCabinetdoorProps, RfidTipsAlarmRecord } from 'database'
import { getReportData } from './rfid'
import { currentCabinet } from './cabinet'
import { AlarmContentType, AlarmObjectType, AlarmType, OperationStatus } from '~/enums'

export enum BorrowedState {
  Returned,
  Borrowed,
}

async function updateCarrier(cabinetDoor: RfidCabinetdoorProps, userId: bigint) {
  const rfidList = getReportData(cabinetDoor.txAddr)
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ rfidList.length:', rfidList.length)

  const map = {
    e280110c2000731c782f0a8b: '检测到文件一',
    e280110c2000759c783a0a8b: '检测到文件二',
    e280110c20007adb783e0a8b: '检测到文件三',
  }
  rfidList.forEach((item) => {
    if (map[item]) console.log(map[item])
  })

  const documents = await selectDocDocumentList()

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]
    const isDetectedDocument = rfidList.includes(doc.docRfid)

    // 如果是本柜门的文件
    if (doc.deptId === cabinetDoor.cabinet.deptId) {
      let updatedDocPStatus
      if (isDetectedDocument && doc.docPStatus === BorrowedState.Borrowed) {
        updatedDocPStatus = BorrowedState.Returned
      } else if (!isDetectedDocument && doc.docPStatus === BorrowedState.Returned) {
        updatedDocPStatus = BorrowedState.Borrowed
      }

      console.log(updatedDocPStatus, 'updatedDocPStatus')

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
    } else {
      // 检测到本部门之外的文件
      if (!isDetectedDocument) continue
      // 查询是否已经有该文件的错放记录
      const hasMisPlaceRecord =
        (await selectRfidTipsAlarmRecordListCount({
          doorid: cabinetDoor.id,
          rfid: doc.docRfid,
          contentType: AlarmContentType.IncorrectLocation,
          isOperation: OperationStatus.Unoperated,
        })) !== 0

      if (hasMisPlaceRecord) continue
      const data: Partial<RfidTipsAlarmRecord> = {
        alarmType: `${AlarmObjectType.Carrier}`,
        type: AlarmType.Alarm,
        userId: Number(userId),
        operationid: '',
        createDate: new Date(),
        cadinetId: currentCabinet?.id,
        doorid: cabinetDoor.id,
        content: `${doc.docName}存放位置错误`,
        contentType: AlarmContentType.IncorrectLocation,
        rfid: doc.docRfid,
        groupid: doc.userId,
        docId: doc.docId,
        docCarName: doc.docName,
        deptName: doc.department.deptName,
        cabName: currentCabinet?.name,
        cabdoorName: `${cabinetDoor?.name}`,
        opeUserName: '',
        cabdoorUserName: '',
        cabdoorDeptName: '',
        isOperation: OperationStatus.Unoperated,
      }

      await insertRfidTipsAlarmRecord(data)
    }
  }

  const misPlaceRecordList = await selectRfidTipsAlarmRecordList({
    isOperation: OperationStatus.Unoperated,
    doorid: cabinetDoor.id,
  })
  for (let i = 0; i < misPlaceRecordList.length; i++) {
    const doc = misPlaceRecordList[i]
    if (!doc.rfid) continue

    if (!rfidList.includes(doc.rfid)) {
      await updateRfidTipsAlarmRecord(
        {
          rfid: doc.rfid,
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
    selectRfidTipsAlarmRecordList,
    updateCarrier,
  },
}

export default carrierService
