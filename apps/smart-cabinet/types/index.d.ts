import type { DocDocument, RfidCabinetdoorProps } from '@smart-cabinet/database'
import type { ServiceType } from '../main/services/index'
import type { InPlaceState } from './enums'

export {}

type JSBridgeType = {
  [name in ServiceType[number]['name']]: ServiceType[number] extends infer T ? (T extends { name: name, fns: infer F } ? F : never) : never
}

declare global {
  var databaseIsConnected: boolean

  interface Window {
    JSBridge: JSBridgeType
  }

  interface ResponseProps<T = unknown> {
    success: boolean
    msg?: string
    data?: T
  }

  interface PasswordLoginProps {
    username: string
    password: string
  }

  interface CarrierQuantityProps {
    count: number
    inPlaceCount: number
  }

  interface UpdateCardProps {
    userId: number
    cardNumber: string
  }

  type CabinetDoorProps = RfidCabinetdoorProps & {
    isOpen: boolean
    rfidIsConnected: boolean
    checkCountdown: number
  }

  interface LockControlStateProps {
    [x: number]: boolean
  }

  interface PaginationType {
    page: number
    size: number
  }

  interface CarrierQueryProps {
    title?: string
    deptId?: number
    cabinetDoorId?: number
    state?: InPlaceState
  }

  interface UserQueryProps {
    userName?: string
    deptId?: number
    roleId?: number
  }

  interface DepartmentQueryProps {
    deptName?: string
  }

  type CheckResultType = CabinetDoorProps & {
    borrowCarriers: DocDocument[]
    returnCarriers: DocDocument[]
    misPlaceCarrierRecords: rfidSwitchRecord[]
  }

  type FingerOrder = 1 | 2
}
