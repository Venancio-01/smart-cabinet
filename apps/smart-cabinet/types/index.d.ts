import { DocDocument, RfidCabinetdoor, SysUser, RfidSwitchRecord, SysRole, SysUserRole, SysDept,RfidCabinetdoorProps } from 'database'
import type { ServiceType } from '../main/services/index'
import {InPlaceState} from './enums'
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

  type CabinetDoorProps = RfidCabinetdoorProps & {
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

  type CarrierQueryProps = {
    title?: string
    deptId?: number
    cabinetDoorId?: number,
    state?: InPlaceState
  }

  type UserQueryProps = {
    userName?: string
    deptId?: number
    roleId?: number
  }

  type DepartmentQueryProps = {
    deptName?: string
  }

  type CheckResultType = CabinetDoorProps & {
    borrowCarriers: DocDocument[]
    returnCarriers: DocDocument[]
    misPlaceCarrierRecords: rfidSwitchRecord[]
  }

  type FingerOrder = 1 | 2
}
