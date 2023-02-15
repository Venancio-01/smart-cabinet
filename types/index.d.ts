import { rfid_cabinet_door, sys_user } from '@prisma/client'
export {}

type ServiceType = typeof import('../packages/main/src/services').services

type JSBridgeType = {
  login: ServiceType[0]['fns']
  lockControl: ServiceType[1]['fns']
  rfid: ServiceType[2]['fns']
  finger: ServiceType[3]['fns']
  sys: ServiceType[4]['fns']
  cabinet: ServiceType[5]['fns']
  document: ServiceType[6]['fns']
  card: ServiceType[7]['fns']
  network: ServiceType[8]['fns']
}

declare global {
  interface Window {
    JSBridge: JSBridgeType
  }

  type JSBridge = JSBridgeType

  interface ResponseProps<T = unknown> {
    success: boolean
    msg?: string
    data?: T
  }

  interface UserProps extends sys_user {
    roleName: string
    deptName: string
  }

  interface PasswordLoginProps {
    username: string
    password: string
  }

  interface DocumentQuantityProps {
    count: number
    inPlaceCount: number
  }

  interface UpdateCardProps {
    userId: number
    cardNumber: string
  }

  interface CabinetDoorProps extends rfid_cabinet_door {
    totalDocumentCount: number
    inPlaceDocumentCount: number
    isSelected: boolean
    name: string | null | undefined
    checkCountDown: number
    isOpen: boolean
  }

  interface LockControlStateProps {
    [x: number]: boolean
  }

  interface DocumentQueryProps {
    page?: number
    size?: number
    title?: string
    state?: number | null
    cabinetId?: number | null
  }

  type FingerOrder = 1 | 2
}
