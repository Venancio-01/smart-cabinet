import type {
  DoorEquipment,
  Prisma,
} from '@smart-cabinet/database'
import type { electronAPI } from '@electron-toolkit/preload'
import type { AccessDirection, AccessTimeRange } from './enums'

declare global {
  interface Window {
    electronApi: electronAPI
  }

  interface PaginationType {
    page: number
    size: number
  }

  interface ReadRecordQueryProps {
    carrierName: string
    equipmentId?: number
    deptId?: string
    type?: AccessDirection
    timeRange?: AccessTimeRange
  }

  interface AlarmQueryProps {
    carrierName?: string
    equipmentId?: number
    deptId?: number
    timeRange?: AccessTimeRange
  }

  interface RFIDParseType {
    TID: string
    EPC: string
  }

  type EquipmentProps = DoorEquipment & {
    rfidIsConnected: boolean
    detectionResult: EquipmentDetectionResult | null
    detectionState: EquipmentDetectionState | null
    direction: AccessDirection | null
    isAlerting: boolean
    rfidRecordList: DoorRfidrecord[]
    _count: Prisma.DoorEquipmentCountOutputType
  }

  type AlarmEquipmentProps = DoorEquipment & {
    alarmRecordList: DoorAlarmrecord[]
  }

  type ActiveEquipmentProps = DoorEquipment & {
    direction?: AccessDirection
    readRecordList?: DoorRfidrecord[]
    alarmRecordList?: DoorAlarmrecord[]
    state?: ActiveEquipmentState
    loading?: boolean
  }
}
