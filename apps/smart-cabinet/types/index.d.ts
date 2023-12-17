import type { DocDocument, RfidCabinetdoorProps } from '@smart-cabinet/database'
import type { ElectronAPI } from '@electron-toolkit/preload'
import type { InPlaceState } from './enums'

export {}

declare global {
  interface Window {
    electronApi: ElectronAPI
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
