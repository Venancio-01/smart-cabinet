import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setFirstCarrierRecord, setFirstMisPlaceCarrierRecord, setEndCarrierRecord, setEndMisPlaceCarrierRecord, setCheckResultList } =
    store

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
    resetCheckResult,
  }
}
