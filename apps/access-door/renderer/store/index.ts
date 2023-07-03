import { defineStore } from 'pinia'
import type { DocDocument, DoorAlarmrecord, DoorEquipment, DoorRfidrecord, RfidCabinetdoor, SysDept } from 'database'

interface State {
  currentEquipment: DoorEquipment | null
  networkIsConnected: boolean
  rfidIsConnected: boolean
  activationCode: string
  carrierList: DocDocument[]
  cabinetDoorList: RfidCabinetdoor[]
  departmentList: SysDept[]
  currentReadRecordList: DoorRfidrecord[]
  alarmRecordList: DoorAlarmrecord[]
  loadingVisible: boolean
  unviewedAccessRecordCount: number
}

export const useStore = defineStore('main', {
  state: (): State => {
    return {
      currentEquipment: null,
      networkIsConnected: false,
      rfidIsConnected: false,
      activationCode: '',
      carrierList: [],
      cabinetDoorList: [],
      departmentList: [],
      currentReadRecordList: [],
      alarmRecordList: [],
      loadingVisible: false,
      unviewedAccessRecordCount: 0,
    }
  },
  getters: {
    hasUnprocessedAlarmRecord(state) {
      return state.alarmRecordList.length > 0 && state.alarmRecordList.some((item) => item.isOperation === '0')
    },
  },
  actions: {
    setActivationCode(code: string) {
      this.activationCode = code
    },
    setRfidIsConnected(state: boolean) {
      this.rfidIsConnected = state
    },
    setNetworkIsConnected(state: boolean) {
      this.networkIsConnected = state
    },
    setCarrierList(list: DocDocument[]) {
      this.carrierList = list
    },
    setCabinetDoorList(list: RfidCabinetdoor[]) {
      this.cabinetDoorList = list
    },
    setDepartmentList(list: SysDept[]) {
      this.departmentList = list
    },
    setCurrentReadRecordList(list: DoorRfidrecord[]) {
      this.currentReadRecordList = list
    },
    setAlarmRecordList(list: DoorAlarmrecord[]) {
      this.alarmRecordList = list
    },
    setCurrentEquipment(device: DoorEquipment | null) {
      this.currentEquipment = device
    },
    setLoadingVisible(state: boolean) {
      this.loadingVisible = state
    },
    setUnviewedAccessRecordCount(count: number) {
      this.unviewedAccessRecordCount = count
    },
  },
})
