import {
  insertRfidTipsAlarmRecord,
  selectDocDocumentList,
  selectDocDocumentListWithPage,
  selectRfidTipsAlarmRecordList,
  selectRfidTipsAlarmRecordListCount,
  updateDocDocument,
  updateRfidTipsAlarmRecord,
} from '@smart-cabinet/database'
import type { RfidCabinetdoorProps, RfidTipsAlarmRecord } from '@smart-cabinet/database'
import { getRfidTIDList } from '@smart-cabinet/features'
import { ipcMain } from 'electron'
import { currentCabinet } from './cabinet'
import { AlarmContentType, AlarmObjectType, AlarmType, OperationStatus } from '~/enums'
import { CARRIER_EVENT_NAME } from '#/ipcNames'

export enum BorrowedState {
  Returned,
  Borrowed,
}

async function updateCarrier(cabinetDoor: RfidCabinetdoorProps, userId: bigint) {
  const rfidTidList = getRfidTIDList(cabinetDoor.txAddr || '')
  console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ rfidList.length:', rfidTidList.length)

  // const map = {
  //   e280110c2000731c782f0a8b: '检测到文件一',
  //   e280110c2000759c783a0a8b: '检测到文件二',
  //   e280110c20007adb783e0a8b: '检测到文件三',
  // }
  // rfidTidList.forEach((item) => {
  //   if (map[item]) console.log(map[item])
  // })

  const documents = await selectDocDocumentList()

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]
    const isDetectedDocument = rfidTidList.includes(doc.docRfid)

    // 如果是本部门的文件
    if (doc.deptId === cabinetDoor.cabinet.deptId) {
      // 归还
      if (isDetectedDocument && doc.docPStatus === BorrowedState.Borrowed) {
        await updateDocDocument(
          {
            docId: doc.docId,
          },
          {
            cabinetId: cabinetDoor.cabinet.id,
            cabinetDoorId: cabinetDoor.id,
            docPStatus: BorrowedState.Returned,
            docLastUserId: Number(userId),
            docLastTime: new Date(),
          },
        )
      }
      // 借出
      else if (!isDetectedDocument && doc.docPStatus === BorrowedState.Returned) {
        await updateDocDocument(
          {
            docId: doc.docId,
          },
          {
            docPStatus: BorrowedState.Borrowed,
            docLastUserId: Number(userId),
            docLastTime: new Date(),
          },
        )
      }
    }
    // 检测到本部门之外的文件
    else {
      if (!isDetectedDocument) continue
      // 查询是否已经有该文件的错放记录
      const hasMisPlaceRecord
        = (await selectRfidTipsAlarmRecordListCount({
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

    if (!rfidTidList.includes(doc.rfid)) {
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

export function registerCarrierModule() {
  ipcMain.handle(CARRIER_EVENT_NAME.selectDocDocumentList, async (_event, params) => {
    return await selectDocDocumentList(params)
  })

  ipcMain.handle(CARRIER_EVENT_NAME.selectDocDocumentListWithPage, async (_event, params) => {
    return await selectDocDocumentListWithPage(params)
  })

  ipcMain.handle('carrier:select-rfid-tips-alarm-record-list', async (_event, params) => {
    return await selectRfidTipsAlarmRecordList(params)
  })

  ipcMain.handle('carrier:update-carrier', async (_event, cabinetDoor, userId) => {
    return await updateCarrier(cabinetDoor, userId)
  })
}
