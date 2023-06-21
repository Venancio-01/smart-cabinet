import { DocDocument, RfidCabinetdoor, SysUser, RfidSwitchRecord, SysRole, SysUserRole, SysDept } from 'database'
import type { ServiceType } from '../main/services/index'
export {}

type JSBridgeType = {
  [name in ServiceType[number]['name']]: ServiceType[number] extends infer T ? (T extends { name: name; fns: infer F } ? F : never) : never
}

declare global {
  var databaseIsConnected: boolean

  interface Window {
    JSBridge: JSBridgeType
  }

  type ResponseProps<T = unknown> = {
    success: boolean
    msg?: string
    data?: T
  }

  type PasswordLoginProps = {
    username: string
    password: string
  }

  type CarrierQuantityProps = {
    count: number
    inPlaceCount: number
  }

  type UpdateCardProps = {
    userId: number
    cardNumber: string
  }

  type CabinetDoorProps = RfidCabinetdoor & {
    isOpen: boolean
    rfidIsConnected: boolean
    checkCountdown: number
  }

  type LockControlStateProps = {
    [x: number]: boolean
  }

  type PaginationType = {
    page: number
    size: number
  }

  type CarrierQueryProps = PaginationType & {
    title?: string
    cabinetId?: number
    departmentId?: number
    state?: number
  }

  type UserQueryProps = PaginationType & {
    userName?: string
    departmentId?: number
    roleId?: number
  }

  type DepartmentQueryProps = PaginationType & {
    departmentName?: string
  }

  type CheckResultType = CabinetDoorProps & {
    borrowCarriers: DocDocument[]
    returnCarriers: DocDocument[]
    misPlaceCarrierRecords: rfidSwitchRecord[]
  }

  type FingerOrder = 1 | 2
}
