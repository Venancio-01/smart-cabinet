import {
  doc_document,
  rfid_cabinet_door,
  sys_user,
  rfid_switch_record,
  sys_role,
  sys_user_role,
  sys_dept,
  sys_role_permission,
  sys_permission
} from '@prisma/client'
import type { ServiceType } from '../main/services/index'
export { }

type JSBridgeType = {
  [name in ServiceType[number]['name']]: ServiceType[number] extends infer T ? (T extends { name: name; fns: infer F } ? F : never) : never
}

declare global {
  interface Window {
    JSBridge: JSBridgeType
  }

  type ResponseProps<T = unknown> = {
    success: boolean
    msg?: string
    data?: T
  }

  type UserProps = sys_user & {
    sys_dept: sys_dept | null
    sys_user_role: (sys_user_role & {
      sys_role: sys_role & {
        sys_role_permission: sys_role_permission & {
          sys_permission: sys_permission
        }
      }
    })[]
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

  type CabinetDoorProps = rfid_cabinet_door & {
    departmentName: string | null | undefined
    checkCountdown: number
    isOpen: boolean
  }

  type LockControlStateProps = {
    [x: number]: boolean
  }

  type CarrierQueryProps = {
    page: number
    size: number
    title?: string
    cabinetId?: number
    departmentId?: number
    state?: number
  }

  type UserQueryProps = {
    page: number
    size: number
    userName?: string
    departmentId?: number
    roleId?: number
  }

  type DepartmentQueryProps = {
    page: number
    size: number
    departmentName?: string
  }

  type CheckResultType = CabinetDoorProps & {
    borrowCarriers: doc_document[]
    returnCarriers: doc_document[]
    misPlaceCarrierRecords: rfid_switch_record[]
  }

  type UserWithRoleProps = sys_user & {
    role: sys_role | null
  }

  type RFIDParseType = {
    TID: string
    EPC: string
  }
}
