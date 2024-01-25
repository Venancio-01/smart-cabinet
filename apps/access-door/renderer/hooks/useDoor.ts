import type { Prisma } from '@smart-cabinet/database'
import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import { useStore } from '@/store'
import { AccessDirection, AccessTimeRange } from '~/enums'

export default function () {
  const store = useStore()
  const { setIsControlEquipment, setEquipmentList, setUnviewedAccessRecordCount, setControlEquipment } = store
  const { equipmentList } = storeToRefs(store)

  const getControlEquipment = async () => {
    const equipment = await rendererInvoke('access-door:get-control-equipment')
    setControlEquipment(equipment)
  }

  const getIsControlEquipment = async () => {
    const isEquipment = await rendererInvoke('access-door:get-is-control-equipment')
    setIsControlEquipment(isEquipment)
  }

  const getEquipmentList = async () => {
    const result = await rendererInvoke('access-door:get-equipment-list')
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

    const query: Prisma.DoorRfidrecordWhereInput = {
      equipmentId: {
        in: equipmentList.value.map(item => `${item.equipmentid}`),
      },
      carrierName: condition?.carrierName ? { contains: condition.carrierName } : undefined,
      creatorTime: condition?.timeRange ? timeRangeMap?.[condition.timeRange] : undefined,
    }

    if (condition?.type !== AccessDirection.ALL) {
      query.type = condition.type ? `${condition.type}` : undefined
    }

    // return window.JSBridge.accessDoor.selectDoorRfidrecordListWithPage(pagination, query)
    return rendererInvoke('access-door:select-door-rfidrecord-list-with-page', { pagination, query })
  }

  // 获取未查看的报警记录总数
  const selectUnviewedAlarmRecordCount = async () => {
    // const result = await window.JSBridge.accessDoor.selectDoorAlarmRecordCount({
    //   equipmentId: {
    //     in: equipmentList.value.map(item => `${item.equipmentid}`),
    //   },
    //   isOperation: '0',
    // })

    const result = await rendererInvoke('access-door:select-door-alarm-record-count', {
      equipmentId: {
        in: equipmentList.value.map(item => `${item.equipmentid}`),
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

    const query: Prisma.DoorAlarmrecordWhereInput = {
      equipmentId: {
        in: equipmentList.value.map(item => `${item.equipmentid}`),
      },
      carrierName: condition?.carrierName ? { contains: condition.carrierName } : undefined,
      carrierDeptid: condition?.deptId,
      createTime: condition?.timeRange ? timeRangeMap?.[condition.timeRange] : undefined,
    }

    return await rendererInvoke('access-door:select-door-alarm-record-list-with-page', { pagination, query })
  }

  const initAccessDoorData = async () => {
    await getIsControlEquipment()
    await getEquipmentList()
    await selectUnviewedAlarmRecordCount()
    getControlEquipment()
  }

  return {
    initAccessDoorData,
    selectRfidRecordList,
    selectAlarmRecordList,
    selectUnviewedAlarmRecordCount,
  }
}
