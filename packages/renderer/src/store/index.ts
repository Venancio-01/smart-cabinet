import { CHECK_TIME, OPERATION_TIMEOUT } from '@/config'
import { doc_document, rfid_cabinet, rfid_switch_record, sys_dept } from '@prisma/client'
import { defineStore } from 'pinia'

interface State {
  lockControlIsOnline: boolean
  networkIsOnline: boolean
  fingerIsOnline: boolean
  rfidIsOnline: boolean
  loginVisible: boolean
  loginModeIndex: number
  isLoggedIn: boolean
  user: UserProps | null
  departmentList: sys_dept[]
  documentList: doc_document[]
  misPlaceDocumentData: rfid_switch_record[]
  cabinetData: rfid_cabinet | null
  cabinetDoorList: CabinetDoorProps[]
  operationTimeout: number
  lockCommandInterval: number
  lockControlState: null | LockControlStateProps
  currentCabinetDoorId: number
  viewDocumentVisible: boolean
  checkStatusDialogVisible: boolean
  currentCheckCabinetDoor: CabinetDoorProps | null
}

export const useStore = defineStore('main', {
  state: (): State => {
    return {
      lockControlIsOnline: true,
      networkIsOnline: true,
      fingerIsOnline: false,
      rfidIsOnline: true,
      loginVisible: false,
      loginModeIndex: 1,
      isLoggedIn: false,
      user: null,
      departmentList: [],
      documentList: [],
      cabinetData: null,
      cabinetDoorList: [],
      misPlaceDocumentData: [],
      operationTimeout: OPERATION_TIMEOUT,
      lockCommandInterval: 10,
      lockControlState: null,
      currentCabinetDoorId: 0,
      viewDocumentVisible: false,
      checkStatusDialogVisible: false,
      currentCheckCabinetDoor: null
    }
  },
  getters: {
    misPlaceDocumentCount(state) {
      return state.misPlaceDocumentData.length
    },
    documentTotal(state) {
      return state.documentList.length
    },
    inPlaceDocumentTotal(state) {
      return state.documentList.reduce((total, item) => {
        if (item.doc_reissue_number === 0) total += 1
        return total
      }, 0)
    },
    isChecking(state) {
      return state.cabinetDoorList.some(item => item.checkCountDown !== 10)
    }
  },
  actions: {
    changeRfidIsConnected(state: boolean) {
      this.rfidIsOnline = state
    },
    changeLockControlIsOnline(state: boolean) {
      this.lockControlIsOnline = state
    },
    changeFingerIsOnline(state: boolean) {
      this.fingerIsOnline = state
    },
    changeNetworkIsOnline(state: boolean) {
      this.networkIsOnline = state
    },
    changeLoginVisible(visible: boolean) {
      this.loginVisible = visible
    },
    changeIsLoggedIn(visible: boolean) {
      this.isLoggedIn = visible
    },
    changeLoginModeIndex(index: number) {
      this.loginModeIndex = index
    },
    saveCabinetData(data: rfid_cabinet) {
      this.cabinetData = data
    },
    saveCabinetDoorList(list: CabinetDoorProps[]) {
      this.cabinetDoorList = list
    },
    changeCabinetDoorData(data: CabinetDoorProps) {
      const id = data.id
      const index = this.cabinetDoorList.findIndex(item => item.id === id)
      this.cabinetDoorList[index] = data
    },
    saveMisPlaceDocumentData(data: rfid_switch_record[]) {
      this.misPlaceDocumentData = data
    },
    saveUserData(user: UserProps | null) {
      this.user = user
    },
    saveDepartmentList(list: sys_dept[]) {
      this.departmentList = list
    },
    saveDocumentList(list: doc_document[]) {
      this.documentList = list
    },
    changeOperationTimeout(time: number) {
      this.operationTimeout = time
    },
    resetOperationTimeout() {
      this.changeOperationTimeout(OPERATION_TIMEOUT)
    },
    changeLockCommandInterval(time: number) {
      this.lockCommandInterval = time
    },
    changeLockControlState(state: LockControlStateProps | null) {
      this.lockControlState = state
    },
    changeCurrentCabinetDoorId(id: number) {
      this.currentCabinetDoorId = id
    },
    changeViewDocumentVisible(visible: boolean) {
      this.viewDocumentVisible = visible
    },
    changeCheckStatusDialogVisible(visible: boolean) {
      this.checkStatusDialogVisible = visible
    },
    changeCurrentCheckCabinetDoor(cabinetDoor: CabinetDoorProps | null) {
      this.currentCheckCabinetDoor = cabinetDoor
    }
  }
})
