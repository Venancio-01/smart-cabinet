import { JSBridgeType } from '../packages/main/src/preload'
import { rfid_cabinet_door } from '@prisma/client'
export {}

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

  interface UserProps {
    USER_ID: number
    AVATAR: string
    CODE: string
    CREATE_BY: string
    CREATE_TIME: string
    DEL_FLAG: string
    DEPT_ID: number
    EMAIL: string
    LOGIN_DATE: string
    LOGIN_IP: string
    LOGIN_NAME: string
    PASSWORD: string
    PHONENUMBER: string
    REMARK: string
    SALT: string
    SEX: string
    STATUS: string
    TYPE: number
    UPDATE_BY: string
    UPDATE_TIME: string
    USER_NAME: string
    USER_TYPE: string
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
