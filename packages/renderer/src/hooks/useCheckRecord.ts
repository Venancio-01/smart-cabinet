import { useCheckStore } from '@/store/check'

export default function () {
  const checkStore = useCheckStore()
  const {
    setFirstDocumentRecord,
    setFirstMisPlaceDocumentRecord,
    setEndDocumentRecord,
    setEndMisPlaceDocumentRecord,
    setCheckResultList
  } = checkStore

  /**
   * @description: 重置盘点记录
   * @return {*}
   */
  const resetCheckRecord = () => {
    setFirstDocumentRecord([])
    setFirstMisPlaceDocumentRecord([])
    setEndDocumentRecord([])
    setEndMisPlaceDocumentRecord([])
  }

  /**
   * @description: 重置盘点结果
   * @return {*}
   */
  const resetCheckResult = () => {
    setCheckResultList([])
  }

  return {
    resetCheckRecord,
    resetCheckResult
  }
}
