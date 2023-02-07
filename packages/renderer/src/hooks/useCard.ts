import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'

export default function () {
  const store = useStore()
  const { user } = storeToRefs(store)

  /**
   * @description: 更新卡号
   * @param {string} cardNumber
   * @return {*}
   */
  const updateCardNumber = async (cardNumber: string) => {
    if (cardNumber === '') {
      createAlert('请输入卡号')
      return false
    }

    if (user.value === null) return false

    const success = await window.JSBridge.card.updateCardNumber(user.value.USER_ID, cardNumber)
    const tips = success ? '卡号设置成功' : '卡号设置失败'
    createAlert(tips)

    return success
  }

  return {
    updateCardNumber
  }
}
