import type { DoorAccessRecords, Prisma } from 'database'
import { useStore } from '@/store'
import { AccessDirection, AccessTimeRange } from '~/enums'

export default function () {
  const store = useStore()
  const { setAlarmRecordList, setCurrentEquipment, setUnviewedAccessRecordCount } = store

  const getCurrentEquipment = async () => {
    const result = await window.JSBridge.accessDoor.getCurrentEquipment()
    setCurrentEquipment(result)
  }

  // 获取出入记录
  const selectAccessRecordList = (condition?: Partial<AccessRecordQueryProps>, pagination?: PaginationType) => {
    const query: Prisma.DoorAccessRecordsWhereInput = {}

    if (condition?.accessDirection !== AccessDirection.ALL) {
      query.accessDirection = condition?.accessDirection
    }

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
    query.directionCreateTime = timeRangeMap?.[condition.timeRange]
    console.log('🚀 ~ file: useDoor.ts:35 ~ selectAccessRecordList ~ query:', query)

    return window.JSBridge.accessDoor.selectDoorAccessRecordList(query, pagination)
  }

  // 获取未查看的出入记录总数
  const selectUnviewedAccessRecordCount = async () => {
    const result = await window.JSBridge.accessDoor.selectDoorAlarmRecordCount({
      isOperation: '0',
    })
    setUnviewedAccessRecordCount(result)
  }

  const updateAccessRecord = async (id: number, data: Partial<DoorAccessRecords>) => {
    const result = await window.JSBridge.accessDoor.updateDoorAccessRecord(
      {
        accessId: id,
      },
      data,
    )
    return result
  }

  // 获取告警记录
  const fetchAlarmRecords = async (condition?: Partial<AlarmQueryProps>) => {
    const result = await window.JSBridge.accessDoor.fetchAlarmRecords(condition)
    return result
  }

  const selectAlarmRecordList = async () => {
    const { data } = await fetchAlarmRecords()
    setAlarmRecordList(data)
  }

  const fetchReadRecords = async (condition?: Partial<ReadRecordQueryProps>) => {
    const result = await window.JSBridge.accessDoor.fetchReadRecords(condition)
    return result
  }

  const init = () => {
    return Promise.all([selectUnviewedAccessRecordCount(), getCurrentEquipment(), selectAlarmRecordList()])
  }

  return {
    init,
    selectAccessRecordList,
    updateAccessRecord,
    selectUnviewedAccessRecordCount,
    fetchAlarmRecords,
    selectAlarmRecordList,
    fetchReadRecords,
  }
}
