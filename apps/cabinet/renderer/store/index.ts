import type {
  DocDocument,
  RfidCabinet,
  RfidSwitchRecord,
  SysDept,
  SysRole,
  SysUser,
  SysUserRole,
} from "database"
import { defineStore } from "pinia";
import { BorrowedState } from "~/enums";

interface State {
  backgroundUrl: string;
  isLockControlConnected: boolean;
  isNetworkConnected: boolean;
  isFingerConnected: boolean;
  isLoggedIn: boolean;
  user: SysUser;
  userList: SysUser[];
  departmentList: SysDept[];
  roleList: SysRole[];
  userRoleList: SysUserRole[];
  carrierList: DocDocument[];
  misPlaceCarrierData: RfidSwitchRecord[];
  currentCabinet: RfidCabinet | null;
  cabinetDoorList: CabinetDoorProps[];
  lockCommandInterval: number;
  lockControlState: null | LockControlStateProps;
  currentCabinetDoorId: number;
  checkCountdownDialogVisible: boolean;
  verifyIdentityDialogVisible: boolean;
  currentCheckCabinetDoorId: number | null;
  checkResultList: DocDocument[];
  reviewCarrierCondition: ReviewCarrierCondition;
  loading: boolean;
  activationCode: string;
}

interface ReviewCarrierCondition {
  cabinetDoorId: number | null;
  state: number | null;
}

export const useStore = defineStore("main", {
  state: (): State => {
    return {
      backgroundUrl: "",
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
      activationCode: "",
    };
  },
  getters: {
    // 是单柜门
    isSingleDoor(state) {
      return state.cabinetDoorList.length === 1;
    },
    misPlaceCarrierTotal(state) {
      return state.misPlaceCarrierData.length;
    },
    carrierTotal(state) {
      return state.carrierList.length;
    },
    hasUnConnectedRfid(state) {
      return (
        state.cabinetDoorList.length > 0 &&
        state.cabinetDoorList.some((item) => !item.rfidIsConnected)
      );
    },
    inPlaceCarrierTotal(state) {
      return state.carrierList.reduce((total, item) => {
        if (item.docPStatus === BorrowedState.Returned) total += 1;
        return total;
      }, 0);
    },
    isChecking(state) {
      return state.cabinetDoorList.some((item) => item.checkCountdown !== 10);
    },
  },
  actions: {
    setBackgroundUrl(url: string) {
      this.backgroundUrl = url;
    },
    setLockControlConnectionStatus(state: boolean) {
      this.isLockControlConnected = state;
    },
    setFingerConnectionStatus(state: boolean) {
      this.isFingerConnected = state;
    },
    setNetworkConnectionStatus(state: boolean) {
      this.isNetworkConnected = state;
    },
    setIsLoggedIn(visible: boolean) {
      this.isLoggedIn = visible;
    },
    setCurrentCabinet(data: RfidCabinet) {
      this.currentCabinet = data;
    },
    setCabinetDoorList(list: CabinetDoorProps[]) {
      this.cabinetDoorList = list;
    },
    setCabinetDoor(data: CabinetDoorProps) {
      const index = this.cabinetDoorList.findIndex(
        (item) => item.id === data.id
      );
      this.cabinetDoorList[index] = data;
    },
    setMisPlaceCarrierData(data: RfidSwitchRecord[]) {
      this.misPlaceCarrierData = data;
    },
    setUserData(user: SysUser | null) {
      this.user = user;
    },
    setUserList(list: SysUser[]) {
      this.userList = list;
    },
    setDepartmentList(list: SysDept[]) {
      this.departmentList = list;
    },
    setRoleList(list: SysRole[]) {
      this.roleList = list;
    },
    setUserRoleList(list: SysUserRole[]) {
      this.userRoleList = list;
    },
    setCarrierList(list: DocDocument[]) {
      this.carrierList = list;
    },
    setLockCommandInterval(time: number) {
      this.lockCommandInterval = time;
    },
    setLockControlState(state: LockControlStateProps | null) {
      this.lockControlState = state;
    },
    setCheckStatusDialogVisible(visible: boolean) {
      this.checkCountdownDialogVisible = visible;
    },
    setVerifyIdentityDialogVisible(visible: boolean) {
      this.verifyIdentityDialogVisible = visible;
    },
    setCurrentCheckCabinetDoorId(cabinetDoorId: number | null) {
      this.currentCheckCabinetDoorId = cabinetDoorId;
    },
    setCheckResultList(result: DocDocument[]) {
      this.checkResultList = result;
    },
    setReviewCarrierCondition(condition: ReviewCarrierCondition) {
      this.reviewCarrierCondition = condition;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
  },
});
