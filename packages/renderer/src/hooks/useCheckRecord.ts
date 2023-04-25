import { useCheckStore } from '@/store/check'

export default function () {
  const checkStore = useCheckStore()
  const {
    setFirstCarrierRecord,
    setFirstMisPlaceCarrierRecord,
    setEndCarrierRecord,
    setEndMisPlaceCarrierRecord,
    setCheckResultList
  } = checkStore

  /**
   * @description: 重置盘点记录
   * @return {*}
   */
  const resetCheckRecord = () => {
    setFirstCarrierRecord([])
    setFirstMisPlaceCarrierRecord([])
    setEndCarrierRecord([])
    setEndMisPlaceCarrierRecord([])
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
