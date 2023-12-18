import type { DocDocumentProps, RfidCabinet, RfidTipsAlarmRecord, SysDept, SysRole, SysUserProps, SysUserRole } from '@smart-cabinet/database'
import { BorrowedState } from '~/enums'

interface ReviewCarrierCondition {
  cabinetDoorId: number | null
  state: number | null
}

export const useGlobalState = createGlobalState(
  () => {
    // state
    const guid = ref<string>('')
    const isLockControlConnected = ref<boolean>(false)
    const isNetworkConnected = ref<boolean>(false)
    const isFingerConnected = ref<boolean>(false)
    const isLoggedIn = ref<boolean>(false)
    const user = ref<SysUserProps>()
    const userList = ref<SysUserProps[]>([])
    const departmentList = ref<SysDept[]>([])
    const roleList = ref<SysRole[]>([])
    const userRoleList = ref<SysUserRole[]>([])
    const carrierList = ref<DocDocumentProps[]>([])
    const misPlaceCarrierList = ref<RfidTipsAlarmRecord[]>([])
    const currentCabinet = ref<RfidCabinet | null>(null)
    const cabinetDoorList = ref<CabinetDoorProps[]>([])
    const lockCommandInterval = ref<number>(0)
    const lockControlState = ref<LockControlStateProps | null>(null)
    const currentCabinetDoorId = ref<number>(0)
    const checkCountdownDialogVisible = ref<boolean>(false)
    const verifyIdentityDialogVisible = ref<boolean>(false)
    const currentCheckCabinetDoorId = ref<number | null>(null)
    const reviewCarrierCondition = ref<ReviewCarrierCondition>(
      {
        cabinetDoorId: null,
        state: null,
      },
    )
    const activationCode = ref<string>('')
    const initialCarrierList = ref<DocDocumentProps[]>([])
    const checkResultList = ref<CheckResultType[]>([])
    const lastOperationCabinetDoorRecords = ref<CabinetDoorProps[]>([])
    const lastOperationCabinetDoorList = ref<CabinetDoorProps[]>([])

    // computed
    const isSingleDoor = computed(() => {
      return cabinetDoorList.value.length === 1
    })

    const misPlaceCarrierTotal = computed(() => {
      return misPlaceCarrierList.value.length
    })

    const carrierTotal = computed(() => {
      return carrierList.value.length
    })

    const hasUnConnectedRfid = computed(() => {
      return cabinetDoorList.value.length > 0 && cabinetDoorList.value.some(item => !item.rfidIsConnected)
    })

    const inPlaceCarrierTotal = computed(() => {
      return carrierList.value.reduce((total, item) => {
        if (item.docPStatus === BorrowedState.Returned) total += 1
        return total
      }, 0)
    })

    const isChecking = computed(() => {
      return cabinetDoorList.value.some(item => item.checkCountdown !== 10)
    })

    // methods
    const setGuid = (value: string) => {
      guid.value = value
    }

    const setLockControlConnectionStatus = (state: boolean) => {
      isLockControlConnected.value = state
    }

    const setFingerConnectionStatus = (state: boolean) => {
      isFingerConnected.value = state
    }

    const setNetworkConnectionStatus = (state: boolean) => {
      isNetworkConnected.value = state
    }

    const setIsLoggedIn = (visible: boolean) => {
      isLoggedIn.value = visible
    }

    const setCurrentCabinet = (data: RfidCabinet) => {
      currentCabinet.value = data
    }

    const setCabinetDoorList = (list: CabinetDoorProps[]) => {
      cabinetDoorList.value = list
    }

    const setCabinetDoor = (data: CabinetDoorProps) => {
      const index = cabinetDoorList.value.findIndex(item => item.id === data.id)
      if (index !== -1) {
        cabinetDoorList.value[index] = data
      }
    }

    const setMisPlaceCarrierData = (data: RfidTipsAlarmRecord[]) => {
      misPlaceCarrierList.value = data
    }

    const setUserData = (userData: SysUserProps) => {
      user.value = userData
    }

    const setUserList = (list: SysUserProps[]) => {
      userList.value = list
    }

    const setDepartmentList = (list: SysDept[]) => {
      departmentList.value = list
    }

    const setRoleList = (list: SysRole[]) => {
      roleList.value = list
    }

    const setUserRoleList = (list: SysUserRole[]) => {
      userRoleList.value = list
    }

    const setCarrierList = (list: DocDocumentProps[]) => {
      carrierList.value = list
    }

    const setLockCommandInterval = (time: number) => {
      lockCommandInterval.value = time
    }

    const setLockControlState = (state: LockControlStateProps | null) => {
      lockControlState.value = state
    }

    const setCheckStatusDialogVisible = (visible: boolean) => {
      checkCountdownDialogVisible.value = visible
    }

    const setVerifyIdentityDialogVisible = (visible: boolean) => {
      verifyIdentityDialogVisible.value = visible
    }

    const setCurrentCheckCabinetDoorId = (cabinetDoorId: number | null) => {
      currentCheckCabinetDoorId.value = cabinetDoorId
    }

    const setReviewCarrierCondition = (condition: ReviewCarrierCondition) => {
      reviewCarrierCondition.value = condition
    }

    const setInitialCarrierList = (record: DocDocumentProps[]) => {
      initialCarrierList.value = record
    }

    const setCheckResultList = (result: CheckResultType[]) => {
      checkResultList.value = result
    }

    const addLastOperationCabinetDoorRecords = (door: CabinetDoorProps) => {
      const isExist = lastOperationCabinetDoorRecords.value.find(item => item.id === door.id)
      if (!isExist) {
        lastOperationCabinetDoorRecords.value.push(door)
      }
    }

    const clearLastOperationCabinetDoorRecords = () => {
      lastOperationCabinetDoorRecords.value = []
    }

    const changeLastOperationCabinetDoorList = (list: CabinetDoorProps[]) => {
      lastOperationCabinetDoorList.value = list
    }

    return {
      guid,
      isLockControlConnected,
      isNetworkConnected,
      isFingerConnected,
      isLoggedIn,
      user,
      userList,
      departmentList,
      roleList,
      userRoleList,
      carrierList,
      misPlaceCarrierList,
      currentCabinet,
      cabinetDoorList,
      lockCommandInterval,
      lockControlState,
      currentCabinetDoorId,
      checkCountdownDialogVisible,
      verifyIdentityDialogVisible,
      currentCheckCabinetDoorId,
      reviewCarrierCondition,
      activationCode,
      initialCarrierList,
      checkResultList,
      lastOperationCabinetDoorRecords,
      lastOperationCabinetDoorList,
      // computed
      isSingleDoor,
      misPlaceCarrierTotal,
      carrierTotal,
      hasUnConnectedRfid,
      inPlaceCarrierTotal,
      isChecking,
      // methods
      setGuid,
      setLockControlConnectionStatus,
      setFingerConnectionStatus,
      setNetworkConnectionStatus,
      setIsLoggedIn,
      setCurrentCabinet,
      setCabinetDoorList,
      setCabinetDoor,
      setMisPlaceCarrierData,
      setUserData,
      setUserList,
      setDepartmentList,
      setRoleList,
      setUserRoleList,
      setCarrierList,
      setLockCommandInterval,
      setLockControlState,
      setCheckStatusDialogVisible,
      setVerifyIdentityDialogVisible,
      setCurrentCheckCabinetDoorId,
      setReviewCarrierCondition,
      setInitialCarrierList,
      setCheckResultList,
      addLastOperationCabinetDoorRecords,
      clearLastOperationCabinetDoorRecords,
      changeLastOperationCabinetDoorList,
    }
  },
)
