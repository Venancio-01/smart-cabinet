import { CONFIRM_TIMEOUT, OPERATION_TIMEOUT } from '@smart-cabinet/utils/config/renderer'
import { closeVerifyIdentityDialog } from './verify'
import { resetCheckRecord, resetCheckResult } from '@/features/check-record'
import { useGlobalState } from '@/store'
import router from '@/router'

// 操作超时倒计时
export const operationTimeout = ref(OPERATION_TIMEOUT)
const operationTimeoutTimer = ref<number | null>(null)
const operationTimeoutVisible = ref(false)
// 确认超时倒计时
export const confirmTimeout = ref(CONFIRM_TIMEOUT)
const confirmTimeoutTimer = ref<number | null>(null)
const confirmTimeoutVisible = ref(false)

const { setIsLoggedIn } = useGlobalState()
const { isLoggedIn } = useGlobalState()
/**
 * @description: 开启操作超时倒计时
 * @return {*}
 */
export function openOperationTimeoutCountdown() {
  if (operationTimeoutTimer.value) return

  operationTimeoutVisible.value = true
  operationTimeoutTimer.value = window.setInterval(() => {
    operationTimeout.value -= 1

    if (operationTimeout.value !== 0) return

    closeOperationTimeoutCountdown()
    closeVerifyIdentityDialog()
    setIsLoggedIn(false)
    router.push('/')
  }, 1000)
}

export function closeOperationTimeoutCountdown() {
  if (operationTimeoutTimer.value) {
    clearInterval(operationTimeoutTimer.value)
    operationTimeoutTimer.value = null
  }

  operationTimeout.value = OPERATION_TIMEOUT
  operationTimeoutVisible.value = false
}

/**
 * @description: 重置操作超时倒计时
 * @param {*} time
 * @return {*}
 */
export function resetOperationTimeoutCountdown(time = OPERATION_TIMEOUT) {
  operationTimeout.value = time
}

/**
 * @description: 开启确认超时倒计时
 * @return {*}
 */
export function openConfirmationTimeCountdown() {
  if (confirmTimeoutTimer.value) return

  confirmTimeoutVisible.value = true
  confirmTimeoutTimer.value = window.setInterval(() => {
    confirmTimeout.value -= 1

    if (confirmTimeout.value !== 0) return

    closeConfirmationTimeCountdown()

    resetCheckRecord()
    resetCheckResult()

    if (isLoggedIn.value) {
      openOperationTimeoutCountdown()
      router.replace('/main')
    }
    else {
      router.replace('/')
    }
  }, 1000)
}

export function closeConfirmationTimeCountdown() {
  if (confirmTimeoutTimer.value) {
    clearInterval(confirmTimeoutTimer.value)
    confirmTimeoutTimer.value = null
  }

  confirmTimeout.value = CONFIRM_TIMEOUT
  confirmTimeoutVisible.value = false
}

/**
 * @description: 重置确认超时倒计时
 * @param {*} time
 * @return {*}
 */
export function resetConfirmationTimeCountdown(time = CONFIRM_TIMEOUT) {
  confirmTimeout.value = time
}

/**
 * @description: 重置所有倒计时
 * @return {*}
 */
export function resetCountdowns() {
  resetOperationTimeoutCountdown()
  resetConfirmationTimeCountdown()
}
