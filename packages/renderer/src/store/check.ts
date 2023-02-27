import { doc_document, rfid_switch_record } from '@prisma/client'
import { defineStore } from 'pinia'

interface State {
  firstDocumentRecord: doc_document[]
  firstMisPlaceDocumentRecord: rfid_switch_record[]
  endDocumentRecord: doc_document[]
  endMisPlaceDocumentRecord: rfid_switch_record[]
  checkResultList: CheckResultType[]
  lastOperationCabinetDoorRecords: CabinetDoorProps[]
  lastOperationCabinetDoorList: CabinetDoorProps[]
}

export const useCheckStore = defineStore('check', {
  state: (): State => {
    return {
      firstDocumentRecord: [],
      firstMisPlaceDocumentRecord: [],
      endDocumentRecord: [],
      endMisPlaceDocumentRecord: [],
      checkResultList: [],
      lastOperationCabinetDoorRecords: [],
      lastOperationCabinetDoorList: []
    }
  },
  getters: {},
  actions: {
    changeFirstDocumentRecord(record: doc_document[]) {
      this.firstDocumentRecord = record
    },
    changeFirstMisPlaceDocumentRecord(record: rfid_switch_record[]) {
      this.firstMisPlaceDocumentRecord = record
    },
    changeEndDocumentRecord(record: doc_document[]) {
      this.endDocumentRecord = record
    },
    changeEndMisPlaceDocumentRecord(record: rfid_switch_record[]) {
      this.endMisPlaceDocumentRecord = record
    },
    changeCheckResultList(result: CheckResultType[]) {
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
