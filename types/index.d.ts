import { doc_document, rfid_cabinet_door, sys_user, rfid_switch_record } from '@prisma/client'
export {}

type ServiceType = import('../packages/main/src/services').ServiceType

type JSBridgeType = {
  [name in ServiceType[number]['name']]: ServiceType[number] extends infer T
    ? T extends { name: name; fns: infer F }
      ? F
      : never
    : never
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
    name: string | null | undefined
    checkCountdown: number
    isOpen: boolean
  }

  interface LockControlStateProps {
    [x: number]: boolean
  }

  interface DocumentQueryProps {
    page: number
    size: number
    title?: string
    cabinetId?: number | null
    departmentId?: number | null
    state?: number | null
  }

  type CheckResultType = CabinetDoorProps & {
    borrowDocuments: doc_document[]
    returnDocuments: doc_document[]
    misPlaceDocumentRecords: rfid_switch_record[]
  }

  type FingerOrder = 1 | 2
}
