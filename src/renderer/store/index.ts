import type { doc_document, rfid_cabinet, rfid_switch_record, sys_dept, sys_role, sys_user, sys_user_role } from '@prisma/client'
import { defineStore } from 'pinia'

interface State {
  backgroundUrl: string
  lockControlIsOnline: boolean
  networkIsOnline: boolean
  fingerIsOnline: boolean
  rfidIsOnline: boolean
  rfidConnectionStatus: boolean[]
  isLoggedIn: boolean
  user: sys_user
  userList: sys_user[]
  departmentList: sys_dept[]
  roleList: sys_role[]
  userRoleList: sys_user_role[]
  carrierList: doc_document[]
  misPlaceCarrierData: rfid_switch_record[]
  currentCabinet: rfid_cabinet | null
  cabinetDoorList: CabinetDoorProps[]
  lockCommandInterval: number
  lockControlState: null | LockControlStateProps
  currentCabinetDoorId: number
  checkCountdownDialogVisible: boolean
  verifyIdentityDialogVisible: boolean
  currentCheckCabinetDoorId: number | null
  checkResultList: doc_document[]
  reviewCarrierCondition: ReviewCarrierCondition
  loading: boolean
  activationCode: string
}

interface ReviewCarrierCondition {
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
      rfidConnectionStatus: [],
      isLoggedIn: false,
      user: null,
      userList: [],
      departmentList: [],
      roleList: [],
      userRoleList: [],
      carrierList: [],
      currentCabinet: null,
      cabinetDoorList: [],
      misPlaceCarrierData: [],
      lockCommandInterval: 10,
      lockControlState: null,
      currentCabinetDoorId: 0,
      checkCountdownDialogVisible: false,
      verifyIdentityDialogVisible: false,
      currentCheckCabinetDoorId: null,
      checkResultList: [],
      loading: true,
      reviewCarrierCondition: {
        cabinetDoorId: null,
        state: null,
      },
      activationCode: '',
    }
  },
  getters: {
    // 是单柜门
    isSingleDoor(state) {
      return state.cabinetDoorList.length === 1
    },
    misPlaceCarrierTotal(state) {
      return state.misPlaceCarrierData.length
    },
    carrierTotal(state) {
      return state.carrierList.length
    },
    hasUnConnectedRfid(state) {
      return state.cabinetDoorList.length > 0 && state.cabinetDoorList.some(item => !item.rfidIsConnected)
    },
    inPlaceCarrierTotal(state) {
      return state.carrierList.reduce((total, item) => {
        if (item.loan_status === 0)
          total += 1
        return total
      }, 0)
    },
    isChecking(state) {
      return state.cabinetDoorList.some(item => item.checkCountdown !== 10)
    },
  },
  actions: {
    setBackgroundUrl(url: string) {
      this.backgroundUrl = url
    },
    setRfidIsConnected(state: boolean) {
      this.rfidIsOnline = state
    },
    setRfidConnectionStatus(status: boolean[]) {
      this.rfidConnectionStatus = status
    },
    setLockControlIsOnline(state: boolean) {
      this.lockControlIsOnline = state
    },
    setFingerIsOnline(state: boolean) {
      this.fingerIsOnline = state
    },
    setNetworkIsOnline(state: boolean) {
      this.networkIsOnline = state
    },
    setIsLoggedIn(visible: boolean) {
      this.isLoggedIn = visible
    },
    setCurrentCabinet(data: rfid_cabinet) {
      this.currentCabinet = data
    },
    setCabinetDoorList(list: CabinetDoorProps[]) {
      this.cabinetDoorList = list
    },
    setCabinetDoor(data: CabinetDoorProps) {
      this.cabinetDoorList = this.cabinetDoorList.reduce((acc: CabinetDoorProps[], cur: CabinetDoorProps) => {
        if (cur.Id === data.Id)
          acc.push(data)
        else acc.push(cur)

        return acc
      }, [])
    },
    setMisPlaceCarrierData(data: rfid_switch_record[]) {
      this.misPlaceCarrierData = data
    },
    setUserData(user: UserProps | null) {
      this.user = user
    },
    setUserList(list: sys_user[]) {
      this.userList = list
    },
    setDepartmentList(list: sys_dept[]) {
      this.departmentList = list
    },
    setRoleList(list: sys_role[]) {
      this.roleList = list
    },
    setUserRoleList(list: sys_user_role[]) {
      this.userRoleList = list
    },
    setCarrierList(list: doc_document[]) {
      this.carrierList = list
    },
    setLockCommandInterval(time: number) {
      this.lockCommandInterval = time
    },
    setLockControlState(state: LockControlStateProps | null) {
      this.lockControlState = state
    },
    setCheckStatusDialogVisible(visible: boolean) {
      this.checkCountdownDialogVisible = visible
    },
    setVerifyIdentityDialogVisible(visible: boolean) {
      this.verifyIdentityDialogVisible = visible
    },
    setCurrentCheckCabinetDoorId(cabinetDoorId: number | null) {
      this.currentCheckCabinetDoorId = cabinetDoorId
    },
    setCheckResultList(result: doc_document[]) {
      this.checkResultList = result
    },
    setReviewCarrierCondition(condition: ReviewCarrierCondition) {
      this.reviewCarrierCondition = condition
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
  },
})
