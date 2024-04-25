import type {
  DoorEquipment,
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
    deptId?: string
    type?: AccessDirection
    timeRange?: AccessTimeRange
  }

  interface AlarmQueryProps {
    carrierName?: string
    deptId?: number
    timeRange?: AccessTimeRange
  }

  interface RFIDParseType {
    TID: string
    EPC: string
  }

  type EquipmentProps = DoorEquipment & {
    rfidIsConnected: boolean
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
