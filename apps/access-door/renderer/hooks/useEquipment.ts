import type { Prisma } from '@smart-cabinet/database'
import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import { useStore } from '@/store'
import { AccessDirection, AccessTimeRange } from '~/enums'
import ipcNames from '#/ipcNames'

export default function () {
  const store = useStore()
  const { setIsControlEquipment, setEquipmentList, setUnviewedAccessRecordCount, setControlEquipment } = store
  const { equipmentList } = storeToRefs(store)

  const getControlEquipment = async () => {
    const equipment = await rendererInvoke(ipcNames.accessDoor.getControlEquipment)
    setControlEquipment(equipment)
  }

  const getIsControlEquipment = async () => {
    const isEquipment = await rendererInvoke(ipcNames.accessDoor.getIsControlEquipment)
    setIsControlEquipment(isEquipment)
  }

  const getEquipmentList = async () => {
    const result = await rendererInvoke(ipcNames.accessDoor.getEquipmentList)
    const list = result.map((item) => {
      return { ...item, rfidIsConnected: false }
    })

    setEquipmentList(list)
  }

  // 获取本通道门 RFID 读取记录
  const selectRfidRecordList = (pagination: PaginationType, condition: ReadRecordQueryProps) => {
    const timeRangeMap = {
      [AccessTimeRange.TODAY]: {
        lte: new Date(),
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      [AccessTimeRange.WEEK]: {
        lte: new Date(),
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      [AccessTimeRange.MONTH]: {
        lte: new Date(),
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }

    const allEquipmentIdList = equipmentList.value.map(item => item.equipmentid)
    const equipmentIdList = condition?.equipmentId ? allEquipmentIdList.filter(item => item === condition.equipmentId) : allEquipmentIdList

    const queryCondition: Prisma.DoorRfidrecordWhereInput = {
      equipmentId: {
        in: equipmentIdList,
      },
      carrierName: condition?.carrierName ? { contains: condition.carrierName } : undefined,
      creatorTime: condition?.timeRange ? timeRangeMap?.[condition.timeRange] : undefined,
    }

    if (condition?.type !== AccessDirection.ALL) {
      queryCondition.type = condition.type ? `${condition.type}` : undefined
    }

    return rendererInvoke(ipcNames.accessDoor.selectDoorRfidrecordListWithPage, { pagination, queryCondition })
  }

  // 获取未查看的报警记录
  const selectUnviewedAlarmRecord = async () => {
    const equipmentIdList = equipmentList.value.map(item => item.equipmentid)
    const result = await rendererInvoke(ipcNames.accessDoor.selectDoorAlarmRecord, {
      equipmentId: {
        in: equipmentIdList,
      },
      isOperation: '0',
    })

    console.log('🚀 - selectUnviewedAlarmRecord - result:', result)
  }

  // 获取未查看的报警记录总数
  const selectUnviewedAlarmRecordCount = async () => {
    const equipmentIdList = equipmentList.value.map(item => item.equipmentid)
    const result = await rendererInvoke(ipcNames.accessDoor.selectDoorAlarmRecordCount, {
      equipmentId: {
        in: equipmentIdList,
      },
      isOperation: '0',
    })

    setUnviewedAccessRecordCount(result)
  }

  // 获取报警记录
  const selectAlarmRecordList = async (pagination: PaginationType, condition: AlarmQueryProps) => {
    const timeRangeMap = {
      [AccessTimeRange.TODAY]: {
        lte: new Date(),
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
      [AccessTimeRange.WEEK]: {
        lte: new Date(),
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      [AccessTimeRange.MONTH]: {
        lte: new Date(),
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }

    const allEquipmentIdList = equipmentList.value.map(item => item.equipmentid)
    const equipmentIdList = condition?.equipmentId ? allEquipmentIdList.filter(item => item === condition.equipmentId) : allEquipmentIdList

    const queryCondition: Prisma.DoorAlarmrecordWhereInput = {
      equipmentId: {
        in: equipmentIdList,
      },
      carrierName: condition?.carrierName ? { contains: condition.carrierName } : undefined,
      carrierDeptid: condition?.deptId,
      createTime: condition?.timeRange ? timeRangeMap?.[condition.timeRange] : undefined,
    }

    return await rendererInvoke(ipcNames.accessDoor.selectDoorAlarmRecordListWithPage, { pagination, queryCondition })
  }

  const initAccessDoorData = async () => {
    await getIsControlEquipment()
    await getEquipmentList()
    await selectUnviewedAlarmRecordCount()
    await selectUnviewedAlarmRecord()
    getControlEquipment()
  }

  return {
    equipmentList,
    initAccessDoorData,
    selectRfidRecordList,
    selectAlarmRecordList,
    selectUnviewedAlarmRecordCount,
  }
}
