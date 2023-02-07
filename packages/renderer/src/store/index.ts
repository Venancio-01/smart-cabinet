import { CHECK_TIME, OPERATION_TIMEOUT } from '@/config'
import { rfid_cabinet, sys_dept } from '@prisma/client'
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
  misPlaceDocumentData: any[]
  cabinetData: rfid_cabinet | null
  cabinetDoorList: CabinetDoorProps[]
  operationTimeout: number
  lockCommandInterval: number
  lockControlState: null | LockControlStateProps
}

export const useStore = defineStore('main', {
  state: (): State => {
    return {
      lockControlIsOnline: true,
      networkIsOnline: true,
      fingerIsOnline: true,
      rfidIsOnline: true,
      loginVisible: false,
      loginModeIndex: 1,
      isLoggedIn: false,
      user: null,
      departmentList: [],
      cabinetData: null,
      cabinetDoorList: [],
      misPlaceDocumentData: [],
      operationTimeout: OPERATION_TIMEOUT,
      lockCommandInterval: 10,
      lockControlState: null
    }
  },
  getters: {
    misPlaceDocumentCount(state) {
      return state.misPlaceDocumentData.length
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
      this.cabinetDoorList = this.cabinetDoorList.map(item => {
        if (item.ID !== data.ID) return item
        else return reactive(data)
      })
    },
    saveMisPlaceDocumentData(data: any[]) {
      this.misPlaceDocumentData = data
    },
    saveUserData(user: UserProps | null) {
      this.user = user
    },
    saveDepartmentList(list: sys_dept[]) {
      this.departmentList = list
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
    }
  }
})
