import type { doc_document, rfid_cabinet, rfid_switch_record, sys_dept, sys_permission, sys_role, sys_user } from '@prisma/client'
import { defineStore } from 'pinia'

interface State {
  backgroundUrl: string
  lockControlIsOnline: boolean
  networkIsOnline: boolean
  fingerIsOnline: boolean
  rfidIsOnline: boolean
  loginModeIndex: number
  isLoggedIn: boolean
  user: UserProps | null
  userList: sys_user[]
  departmentList: sys_dept[]
  roleList: sys_role[]
  permissionList: sys_permission[]
  carrierList: doc_document[]
  misPlaceCarrierData: rfid_switch_record[]
  cabinetData: rfid_cabinet | null
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
      loginModeIndex: 1,
      isLoggedIn: false,
      user: null,
      userList: [],
      departmentList: [],
      roleList: [],
      permissionList: [],
      carrierList: [],
      cabinetData: null,
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
    currentUserPermissionList(state) {
      if (!state.user) { return [] }
      else {
        return state.user.sys_user_role.reduce<sys_permission[]>((acc, cur) => {
          const { sys_role } = cur
          const { sys_role_permission } = sys_role
          const permissionList = sys_role_permission.map(item => item.sys_permission)
          return [...acc, ...permissionList]
        }, [])
      }
    },
  },
  actions: {
    setBackgroundUrl(url: string) {
      this.backgroundUrl = url
    },
    setRfidIsConnected(state: boolean) {
      this.rfidIsOnline = state
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
    setLoginModeIndex(index: number) {
      this.loginModeIndex = index
    },
    setCabinetData(data: rfid_cabinet) {
      this.cabinetData = data
    },
    setCabinetDoorList(list: CabinetDoorProps[]) {
      this.cabinetDoorList = list
    },
    setCabinetDoor(data: CabinetDoorProps) {
      this.cabinetDoorList = this.cabinetDoorList.reduce<CabinetDoorProps[]>((acc, cur) => {
        if (cur.id === data.id)
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
    setPermissionList(list: sys_permission[]) {
      this.permissionList = list
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
