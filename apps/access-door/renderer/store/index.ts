import { defineStore } from "pinia";
import type {
  DocDocument,
  DoorAlarmrecord,
  DoorEquipment,
  DoorRfidrecord,
  RfidCabinetdoor,
  SysDept,
} from "database";

interface State {
  backgroundUrl: string;
  networkIsOnline: boolean;
  rfidIsOnline: boolean;
  activationCode: string;
  carrierList: DocDocument[];
  cabinetDoorList: RfidCabinetdoor[];
  departmentList: SysDept[];
  currentReadRecordList: DoorRfidrecord[];
  alarmRecordList: DoorAlarmrecord[];
  currentAccessDoorDevice: DoorEquipment | null;
  loadingVisible: boolean;
  unviewedAccessRecordCount: number;
}

export const useStore = defineStore("main", {
  state: (): State => {
    return {
      backgroundUrl: "",
      networkIsOnline: false,
      rfidIsOnline: false,
      activationCode: "",
      carrierList: [],
      cabinetDoorList: [],
      departmentList: [],
      currentReadRecordList: [],
      alarmRecordList: [],
      currentAccessDoorDevice: null,
      loadingVisible: false,
      unviewedAccessRecordCount: 0,
    };
  },
  getters: {
    hasUnprocessedAlarmRecord(state) {
      return (
        state.alarmRecordList.length > 0 &&
        state.alarmRecordList.some((item) => item.isOperation === "0")
      );
    },
  },
  actions: {
    setActivationCode(code: string) {
      this.activationCode = code;
    },
    setBackgroundUrl(url: string) {
      this.backgroundUrl = url;
    },
    setRfidIsConnected(state: boolean) {
      this.rfidIsOnline = state;
    },
    setNetworkIsOnline(state: boolean) {
      this.networkIsOnline = state;
    },
    setCarrierList(list: DocDocument[]) {
      this.carrierList = list;
    },
    setCabinetDoorList(list: RfidCabinetdoor[]) {
      this.cabinetDoorList = list;
    },
    setDepartmentList(list: SysDept[]) {
      this.departmentList = list;
    },
    setCurrentReadRecordList(list: DoorRfidrecord[]) {
      this.currentReadRecordList = list;
    },
    setAlarmRecordList(list: DoorAlarmrecord[]) {
      this.alarmRecordList = list;
    },
    setCurrentAccessDoorDevice(device: DoorEquipment | null) {
      this.currentAccessDoorDevice = device;
    },
    setLoadingVisible(state: boolean) {
      this.loadingVisible = state;
    },
    setUnviewedAccessRecordCount(count: number) {
      this.unviewedAccessRecordCount = count;
    },
  },
});
