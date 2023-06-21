import type { DocDocument, RfidSwitchRecord } from 'database'
import { defineStore } from 'pinia'

interface State {
  firstCarrierRecord: DocDocument[]
  firstMisPlaceCarrierRecord: RfidSwitchRecord[]
  endCarrierRecord: DocDocument[]
  endMisPlaceCarrierRecord: RfidSwitchRecord[]
  checkResultList: CheckResultType[]
  lastOperationCabinetDoorRecords: CabinetDoorProps[]
  lastOperationCabinetDoorList: CabinetDoorProps[]
}

export const useCheckStore = defineStore('check', {
  state: (): State => {
    return {
      firstCarrierRecord: [],
      firstMisPlaceCarrierRecord: [],
      endCarrierRecord: [],
      endMisPlaceCarrierRecord: [],
      checkResultList: [],
      lastOperationCabinetDoorRecords: [],
      lastOperationCabinetDoorList: [],
    }
  },
  getters: {},
  actions: {
    setFirstCarrierRecord(record: DocDocument[]) {
      this.firstCarrierRecord = record
    },
    setFirstMisPlaceCarrierRecord(record: RfidSwitchRecord[]) {
      this.firstMisPlaceCarrierRecord = record
    },
    setEndCarrierRecord(record: DocDocument[]) {
      this.endCarrierRecord = record
    },
    setEndMisPlaceCarrierRecord(record: RfidSwitchRecord[]) {
      this.endMisPlaceCarrierRecord = record
    },
    setCheckResultList(result: CheckResultType[]) {
      this.checkResultList = result
    },
    addLastOperationCabinetDoorRecords(door: CabinetDoorProps) {
      const isExist = this.lastOperationCabinetDoorRecords.find((item) => item.id === door.id)
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
