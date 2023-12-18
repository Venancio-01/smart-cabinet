import { useGlobalState } from '@/store'

const callback = ref<(() => void) | null>(null)
const timestamp = ref<number | null>(null)
const EXPIRATION_TIME = 1000 * 60 * 10 // 10分钟

const { setVerifyIdentityDialogVisible } = useGlobalState()

/**
 * @description: 校验是否过期
 * @return {*}
 */
export function verifyIsExpired() {
  if (timestamp.value) {
    const now = new Date().getTime()
    if (now - timestamp.value > EXPIRATION_TIME) return true
    else return false
  }
  else {
    return true
  }
}

export function openVerifyIdentityDialog() {
  setVerifyIdentityDialogVisible(true)
}

export function closeVerifyIdentityDialog() {
  setVerifyIdentityDialogVisible(false)
}

export function saveCallback(cb: () => void) {
  callback.value = cb
}

export function executeCallback() {
  if (callback.value) {
    callback.value()
    callback.value = null
  }
}

export function handleVerificationSuccessful() {
  timestamp.value = new Date().getTime()
  executeCallback()
  closeVerifyIdentityDialog()
}
