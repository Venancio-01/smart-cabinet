import { defineStore } from 'pinia'
import type { DocDocument, DoorAlarmrecord, DoorEquipment, DoorRfidrecord, RfidCabinetdoor, SysDept } from 'database'

interface State {
  isControlEquipment: boolean
  equipmentList: EquipmentProps[]
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
      isControlEquipment: false,
      equipmentList: [],
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
    setIsControlEquipment(state: boolean) {
      this.isControlEquipment = state
    },
    setEquipmentList(equipmentList: EquipmentProps[]) {
      this.equipmentList = equipmentList
    },
    setEquipment(id: number, equipment: Partial<EquipmentProps>) {
      const index = this.equipmentList.findIndex((item) => item.equipmentid === id)
      if (index < 0) return

      this.equipmentList[index] = {
        ...this.equipmentList[index],
        ...equipment,
      }
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
