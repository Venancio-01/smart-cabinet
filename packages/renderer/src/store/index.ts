import { doc_document, rfid_cabinet, rfid_switch_record, sys_dept, sys_user } from '@prisma/client'
import { defineStore } from 'pinia'

interface State {
  backgroundUrl: string
  lockControlIsOnline: boolean
  networkIsOnline: boolean
  fingerIsOnline: boolean
  rfidIsOnline: boolean
  loginVisible: boolean
  loginModeIndex: number
  isLoggedIn: boolean
  user: UserProps | null
  userList: sys_user[]
  departmentList: sys_dept[]
  documentList: doc_document[]
  misPlaceDocumentData: rfid_switch_record[]
  cabinetData: rfid_cabinet | null
  cabinetDoorList: CabinetDoorProps[]
  lockCommandInterval: number
  lockControlState: null | LockControlStateProps
  currentCabinetDoorId: number
  checkStatusDialogVisible: boolean
  verifyIdentityDialogVisible: boolean
  currentCheckCabinetDoorId: number | null
  checkResultList: doc_document[]
  reviewDocumentCondition: ReviewDocumentCondition
}

type ReviewDocumentCondition = {
  cabinetDoorId: number | null
  state: number | null
}

export const useStore = defineStore('main', {
  state: (): State => {
    return {
      backgroundUrl: '',
      lockControlIsOnline: false,
      networkIsOnline: false,
      fingerIsOnline: false,
      rfidIsOnline: false,
      loginVisible: false,
      loginModeIndex: 1,
      isLoggedIn: false,
      user: null,
      userList: [],
      departmentList: [],
      documentList: [],
      cabinetData: null,
      cabinetDoorList: [],
      misPlaceDocumentData: [],
      lockCommandInterval: 10,
      lockControlState: null,
      currentCabinetDoorId: 0,
      checkStatusDialogVisible: false,
      verifyIdentityDialogVisible: false,
      currentCheckCabinetDoorId: null,
      checkResultList: [],
      reviewDocumentCondition: {
        cabinetDoorId: null,
        state: null
      }
    }
  },
  getters: {
    // 是单柜门
    isSingleDoor(state) {
      return state.cabinetDoorList.length === 1
    },
    misPlaceDocumentTotal(state) {
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
      return state.cabinetDoorList.some(item => item.checkCountdown !== 10)
    }
  },
  actions: {
    changeBackgroundUrl(url: string) {
      this.backgroundUrl = url
    },
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
      this.cabinetDoorList = this.cabinetDoorList.reduce<CabinetDoorProps[]>((acc, cur) => {
        if (cur.id === data.id) acc.push(data)
        else acc.push(cur)

        return acc
      }, [])
    },
    saveMisPlaceDocumentData(data: rfid_switch_record[]) {
      this.misPlaceDocumentData = data
    },
    saveUserData(user: UserProps | null) {
      this.user = user
    },
    changeUserList(list: sys_user[]) {
      this.userList = list
    },
    saveDepartmentList(list: sys_dept[]) {
      this.departmentList = list
    },
    saveDocumentList(list: doc_document[]) {
      this.documentList = list
    },
    changeLockCommandInterval(time: number) {
      this.lockCommandInterval = time
    },
    changeLockControlState(state: LockControlStateProps | null) {
      this.lockControlState = state
    },
    changeCheckStatusDialogVisible(visible: boolean) {
      this.checkStatusDialogVisible = visible
    },
    changeVerifyIdentityDialogVisible(visible: boolean) {
      this.verifyIdentityDialogVisible = visible
    },
    changeCurrentCheckCabinetDoorId(cabinetDoorId: number | null) {
      this.currentCheckCabinetDoorId = cabinetDoorId
    },
    saveCheckResultList(result: doc_document[]) {
      this.checkResultList = result
    },
    changeReviewDocumentCondition(condition: ReviewDocumentCondition) {
      this.reviewDocumentCondition = condition
    }
  }
})
