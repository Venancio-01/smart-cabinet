import type { Prisma } from 'database'
import { useStore } from '@/store'
import { AccessDirection, AccessTimeRange } from '~/enums'

export default function () {
  const store = useStore()
  const { setCurrentEquipment, setUnviewedAccessRecordCount } = store
  const { currentEquipment } = storeToRefs(store)

  const getCurrentEquipment = async () => {
    const result = await window.JSBridge.accessDoor.getCurrentEquipment()
    setCurrentEquipment(result)
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

    const query: Prisma.DoorRfidrecordWhereInput = {
      equipmentId: `${currentEquipment.value?.equipmentid}`,
      carrierName: condition?.carrierName ? { contains: condition.carrierName } : undefined,
      creatorTime: timeRangeMap?.[condition.timeRange],
    }

    if (condition?.type !== AccessDirection.ALL) {
      query.type = condition.type ? `${condition.type}` : undefined
    }

    return window.JSBridge.accessDoor.selectDoorRfidrecordListWithPage(pagination, query)
  }

  // 获取未查看的报警记录总数
  const selectUnviewedAlarmRecordCount = async () => {
    const result = await window.JSBridge.accessDoor.selectDoorAlarmRecordCount({
      equipmentId: `${currentEquipment.value?.equipmentid}`,
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

    const query: Prisma.DoorAlarmrecordWhereInput = {
      equipmentId: `${currentEquipment.value?.equipmentid}`,
      carrierName: condition?.carrierName ? { contains: condition.carrierName } : undefined,
      carrierDeptid: condition?.deptId,
      createTime: timeRangeMap?.[condition.timeRange],
    }

    console.log('🚀 ~ file: useDoor.ts:76 ~ selectAlarmRecordList ~ query:', query)

    return await window.JSBridge.accessDoor.selectDoorAlarmRecordListWithPage(pagination, query)
  }

  const initAccessDoorData = async () => {
    await getCurrentEquipment()
    await selectUnviewedAlarmRecordCount()
  }

  return {
    initAccessDoorData,
    selectRfidRecordList,
    selectAlarmRecordList,
    selectUnviewedAlarmRecordCount,
  }
}
