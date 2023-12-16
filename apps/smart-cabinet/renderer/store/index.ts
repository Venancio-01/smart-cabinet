import type { DocDocumentProps, RfidCabinet, RfidTipsAlarmRecord, SysDept, SysRole, SysUserProps, SysUserRole } from '@smart-cabinet/database'
import { defineStore } from 'pinia'
import { BorrowedState } from '~/enums'

interface State {
  guid: string
  isLockControlConnected: boolean
  isNetworkConnected: boolean
  isFingerConnected: boolean
  isLoggedIn: boolean
  user: SysUserProps
  userList: SysUserProps[]
  departmentList: SysDept[]
  roleList: SysRole[]
  userRoleList: SysUserRole[]
  carrierList: DocDocumentProps[]
  misPlaceCarrierList: RfidTipsAlarmRecord[]
  currentCabinet: RfidCabinet | null
  cabinetDoorList: CabinetDoorProps[]
  lockCommandInterval: number
  lockControlState: null | LockControlStateProps
  currentCabinetDoorId: number
  checkCountdownDialogVisible: boolean
  verifyIdentityDialogVisible: boolean
  currentCheckCabinetDoorId: number | null
  reviewCarrierCondition: ReviewCarrierCondition
  activationCode: string
  initialCarrierList: DocDocumentProps[]
  checkResultList: CheckResultType[]
  lastOperationCabinetDoorRecords: CabinetDoorProps[]
  lastOperationCabinetDoorList: CabinetDoorProps[]
}

interface ReviewCarrierCondition {
  cabinetDoorId: number | null
  state: number | null
}

export const useStore = defineStore('main', {
  state: (): State => {
    return {
      guid: '',
      isLockControlConnected: false,
      isNetworkConnected: false,
      isFingerConnected: false,
      isLoggedIn: false,
      user: null,
      userList: [],
      departmentList: [],
      roleList: [],
      userRoleList: [],
      carrierList: [],
      currentCabinet: null,
      cabinetDoorList: [],
      misPlaceCarrierList: [],
      lockCommandInterval: 10,
      lockControlState: null,
      currentCabinetDoorId: 0,
      checkCountdownDialogVisible: false,
      verifyIdentityDialogVisible: false,
      currentCheckCabinetDoorId: null,
      reviewCarrierCondition: {
        cabinetDoorId: null,
        state: null,
      },
      activationCode: '',
      initialCarrierList: [],
      checkResultList: [],
      lastOperationCabinetDoorRecords: [],
      lastOperationCabinetDoorList: [],
    }
  },
  getters: {
    // 是单柜门
    isSingleDoor(state) {
      return state.cabinetDoorList.length === 1
    },
    misPlaceCarrierTotal(state) {
      return state.misPlaceCarrierList.length
    },
    carrierTotal(state) {
      return state.carrierList.length
    },
    hasUnConnectedRfid(state) {
      return state.cabinetDoorList.length > 0 && state.cabinetDoorList.some(item => !item.rfidIsConnected)
    },
    inPlaceCarrierTotal(state) {
      return state.carrierList.reduce((total, item) => {
        if (item.docPStatus === BorrowedState.Returned) total += 1
        return total
      }, 0)
    },
    isChecking(state) {
      return state.cabinetDoorList.some(item => item.checkCountdown !== 10)
    },
  },
  actions: {
    setGuid(value: string) {
      this.guid = value
    },
    setLockControlConnectionStatus(state: boolean) {
      this.isLockControlConnected = state
    },
    setFingerConnectionStatus(state: boolean) {
      this.isFingerConnected = state
    },
    setNetworkConnectionStatus(state: boolean) {
      this.isNetworkConnected = state
    },
    setIsLoggedIn(visible: boolean) {
      this.isLoggedIn = visible
    },
    setCurrentCabinet(data: RfidCabinet) {
      this.currentCabinet = data
    },
    setCabinetDoorList(list: CabinetDoorProps[]) {
      this.cabinetDoorList = list
    },
    setCabinetDoor(data: CabinetDoorProps) {
      const index = this.cabinetDoorList.findIndex(item => item.id === data.id)
      this.cabinetDoorList[index] = data
    },
    setMisPlaceCarrierData(data: RfidTipsAlarmRecord[]) {
      this.misPlaceCarrierList = data
    },
    setUserData(user: SysUserProps) {
      this.user = user
    },
    setUserList(list: SysUserProps[]) {
      this.userList = list
    },
    setDepartmentList(list: SysDept[]) {
      this.departmentList = list
    },
    setRoleList(list: SysRole[]) {
      this.roleList = list
    },
    setUserRoleList(list: SysUserRole[]) {
      this.userRoleList = list
    },
    setCarrierList(list: DocDocumentProps[]) {
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
    setReviewCarrierCondition(condition: ReviewCarrierCondition) {
      this.reviewCarrierCondition = condition
    },
    setInitialCarrierList(record: DocDocumentProps[]) {
      this.initialCarrierList = record
    },
    setCheckResultList(result: CheckResultType[]) {
      this.checkResultList = result
    },
    addLastOperationCabinetDoorRecords(door: CabinetDoorProps) {
      const isExist = this.lastOperationCabinetDoorRecords.find(item => item.id === door.id)
      if (isExist) return

      this.lastOperationCabinetDoorRecords.push(door)
    },
    clearLastOperationCabinetDoorRecords() {
      this.lastOperationCabinetDoorRecords = []
    },
    changeLastOperationCabinetDoorList(list: CabinetDoorProps[]) {
      this.lastOperationCabinetDoorList = list
    },
  },
})
