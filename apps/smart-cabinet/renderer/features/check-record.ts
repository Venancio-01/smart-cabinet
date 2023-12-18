import { useGlobalState } from '@/store'

const { setInitialCarrierList, setCheckResultList } = useGlobalState()

/**
 * @description: 重置盘点记录
 * @return {*}
 */
export function resetCheckRecord() {
  setInitialCarrierList([])
}

/**
 * @description: 重置盘点结果
 * @return {*}
 */
export function resetCheckResult() {
  setCheckResultList([])
}
