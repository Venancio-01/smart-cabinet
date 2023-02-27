import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import { doc_document } from '@prisma/client'

export default function () {
  const store = useStore()
  const { cabinetDoorList } = storeToRefs(store)
  const checkStore = useCheckStore()
  const {
    changeFirstDocumentRecord,
    changeFirstMisPlaceDocumentRecord,
    changeEndDocumentRecord,
    changeEndMisPlaceDocumentRecord,
    changeCheckResultList
  } = checkStore
  const { firstDocumentRecord, endDocumentRecord, endMisPlaceDocumentRecord } = storeToRefs(checkStore)

  /**
   * @description: 重置盘点记录
   * @return {*}
   */
  const resetCheckRecord = () => {
    changeFirstDocumentRecord([])
    changeFirstMisPlaceDocumentRecord([])
    changeEndDocumentRecord([])
    changeEndMisPlaceDocumentRecord([])
  }

  const resetCheckResult = () => {
    changeCheckResultList([])
  }

  /**
   * @description: 生成盘点结果数据
   * @return {*}
   */
  const generateCheckResult = () => {
    const borrowDocuments = firstDocumentRecord.value.reduce<doc_document[]>((acc, cur, index) => {
      if (cur.doc_reissue_number === 0 && endDocumentRecord.value[index].doc_reissue_number === 1) {
        acc.push(endDocumentRecord.value[index])
      }
      return acc
    }, [])

    const returnDocuments = firstDocumentRecord.value.reduce<doc_document[]>((acc, cur, index) => {
      if (cur.doc_reissue_number === 1 && endDocumentRecord.value[index].doc_reissue_number === 0) {
        acc.push(endDocumentRecord.value[index])
      }
      return acc
    }, [])

    const misPlaceDocumentRecords = endMisPlaceDocumentRecord.value

    const result: CheckResultType[] = cabinetDoorList.value.map(door => {
      return {
        ...door,
        borrowDocuments: borrowDocuments.filter(item => item.cabinet_door_id === door.id),
        returnDocuments: returnDocuments.filter(item => item.cabinet_door_id === door.id),
        misPlaceDocumentRecords: misPlaceDocumentRecords.filter(item => item.cabinet_door_id === door.id)
      }
    })

    console.log('🚀 ~ file: useCheck.ts:56 ~ generateCheckResult ~ firstDocumentRecord:', firstDocumentRecord.value)
    console.log('🚀 ~ file: useCheck.ts:56 ~ generateCheckResult ~ endDocumentRecord:', endDocumentRecord.value)
    console.log('🚀 ~ file: useCheck.ts:56 ~ generateCheckResult ~ borrowDocuments:', borrowDocuments)
    console.log('🚀 ~ file: useCheck.ts:56 ~ generateCheckResult ~ returnDocuments:', returnDocuments)
    console.log('🚀 ~ file: useCheck.ts:56 ~ generateCheckResult ~ misPlaceDocumentRecords:', misPlaceDocumentRecords)

    changeCheckResultList(result)
  }

  return {
    generateCheckResult,
    resetCheckRecord,
    resetCheckResult
  }
}
