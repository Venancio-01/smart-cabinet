import {
  DocDocument,
  RfidCabinetdoor,
  sys_user,
  rfid_switch_record,
  sys_role,
  sys_user_role,
  SysDept,
  sys_role_permission,
  sys_permission,
  DoorEquipment,
} from 'database'
import type { ServiceType } from '../main/services/index'
import type { electronAPI } from '@electron-toolkit/preload'
import type { AccessTimeRange } from './enums'
export { }

type JSBridgeType = {
  [name in ServiceType[number]['name']]: ServiceType[number] extends infer T ? (T extends { name: name; fns: infer F } ? F : never) : never
}

declare global {
  var databaseIsConnected: boolean

  interface Window {
    JSBridge: JSBridgeType
    electron: electronAPI
  }

  type PaginationType = {
    page: number
    size: number
  }

  type ReadRecordQueryProps = {
    carrierName: string
    deptId?: number
    type?: AccessDirection
    timeRange?: AccessTimeRange
  }

  type AlarmQueryProps = {
    carrierName?: string
    deptId?: number
    timeRange?: AccessTimeRange
  }

  type RFIDParseType = {
    TID: string
    EPC: string
  }

  type EquipmentProps = DoorEquipment & {
    rfidIsConnected: boolean
  }
}
