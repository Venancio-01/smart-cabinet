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
} from 'database'
import type { ServiceType } from '../main/services/index'
export {}

type JSBridgeType = {
  [name in ServiceType[number]['name']]: ServiceType[number] extends infer T ? (T extends { name: name; fns: infer F } ? F : never) : never
}

declare global {
  interface Window {
    JSBridge: JSBridgeType
  }

  type PaginationType = {
    page: number
    size: number
  }

  type AccessRecordQueryProps = PaginationType & {
    accessDirection: AccessDirection
    hasAlarm: AccessDirection
    timeRange?: AccessTimeRange
    withCarrier?: AccessWithCarrier
  }

  type AlarmQueryProps = PaginationType & {
    accessId?: string
    carrierName?: string
    departmentId?: string
    startTime?: Date
    endTime?: Date
  }

  type ReadRecordQueryProps = PaginationType & {
    accessId?: string
    carrierName?: string
    departmentId?: string
    startTime?: Date
    endTime?: Date
  }

  type UserQueryProps = PaginationType & {
    userName?: string
    departmentId?: number
    roleId?: number
  }

  type DepartmentQueryProps = PaginationType & {
    departmentName?: string
  }

  type UserWithRoleProps = sys_user & {
    role: sys_role | null
  }

  type RFIDParseType = {
    TID: string
    EPC: string
  }

  type GPOIndexType = 1 | 2

  type GPIIndexType = 0 | 1
}
