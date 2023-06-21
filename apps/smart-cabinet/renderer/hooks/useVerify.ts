import { useStore } from '@/store'

const callback = ref<(() => void) | null>(null)
const timestamp = ref<number | null>(null)
const EXPIRATION_TIME = 1000 * 60 * 10 // 10分钟

export default function () {
  const store = useStore()
  const { setVerifyIdentityDialogVisible } = store

  /**
   * @description: 校验是否过期
   * @return {*}
   */
  const verifyIsExpired = () => {
    if (timestamp.value) {
      const now = new Date().getTime()
      if (now - timestamp.value > EXPIRATION_TIME) return true
      else return false
    } else {
      return true
    }
  }

  const openVerifyIdentityDialog = () => {
    setVerifyIdentityDialogVisible(true)
  }

  const closeVerifyIdentityDialog = () => {
    setVerifyIdentityDialogVisible(false)
  }

  const saveCallback = (cb: () => void) => {
    callback.value = cb
  }

  const executeCallback = () => {
    if (callback.value) {
      callback.value()
      callback.value = null
    }
  }

  const handleVerificationSuccessful = () => {
    timestamp.value = new Date().getTime()
    executeCallback()
    closeVerifyIdentityDialog()
  }

  return {
    openVerifyIdentityDialog,
    closeVerifyIdentityDialog,
    verifyIsExpired,
    saveCallback,
    executeCallback,
    handleVerificationSuccessful,
  }
}
