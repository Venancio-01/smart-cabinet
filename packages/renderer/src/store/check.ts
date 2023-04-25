import { doc_document, rfid_switch_record } from '@prisma/client'
import { defineStore } from 'pinia'

interface State {
  firstCarrierRecord: doc_document[]
  firstMisPlaceCarrierRecord: rfid_switch_record[]
  endCarrierRecord: doc_document[]
  endMisPlaceCarrierRecord: rfid_switch_record[]
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
      lastOperationCabinetDoorList: []
    }
  },
  getters: {},
  actions: {
    setFirstCarrierRecord(record: doc_document[]) {
      this.firstCarrierRecord = record
    },
    setFirstMisPlaceCarrierRecord(record: rfid_switch_record[]) {
      this.firstMisPlaceCarrierRecord = record
    },
    setEndCarrierRecord(record: doc_document[]) {
      this.endCarrierRecord = record
    },
    setEndMisPlaceCarrierRecord(record: rfid_switch_record[]) {
      this.endMisPlaceCarrierRecord = record
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
    }
  }
})
