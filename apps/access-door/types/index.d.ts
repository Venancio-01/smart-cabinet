import type {
  DoorEquipment,
} from '@smart-cabinet/database'

import type { electronAPI } from '@electron-toolkit/preload'
import type { ServiceType } from '../main/services/index'
import type { AccessTimeRange } from './enums'

export { }

type JSBridgeType = {
  [name in ServiceType[number]['name']]: ServiceType[number] extends infer T ? (T extends { name: name, fns: infer F } ? F : never) : never
}

declare global {
  var databaseIsConnected: boolean

  interface Window {
    JSBridge: JSBridgeType
    electron: electronAPI
  }

  interface PaginationType {
    page: number
    size: number
  }

  interface ReadRecordQueryProps {
    carrierName: string
    deptId?: number
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
}
