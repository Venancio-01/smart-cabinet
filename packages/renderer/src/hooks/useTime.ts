import dayjs from 'dayjs'
import { useStore } from '@/store'
import useCheckRecord from './useCheckRecord'
import { CONFIRM_TIMEOUT, OPERATION_TIMEOUT } from '@/config'
import useVerify from './useVerify'

const currentTime = ref<string | null>(null)
const currentTimeTimer = ref<number | null>(null)
const operationTimeout = ref(OPERATION_TIMEOUT)
const operationTimeoutTimer = ref<number | null>(null)
const operationTimeoutVisible = ref(false)
const confirmTimeout = ref(CONFIRM_TIMEOUT)
const confirmTimeoutTimer = ref<number | null>(null)
const confirmTimeoutVisible = ref(false)

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setIsLoggedIn } = store
  const { isLoggedIn } = storeToRefs(store)
  const { resetCheckRecord, resetCheckResult } = useCheckRecord()
  const { closeVerifyIdentityDialog } = useVerify()

  /**
   * @description: 生成当前时间
   * @return {*}
   */
  const startGenerateCurrentTime = () => {
    currentTimeTimer.value = window.setInterval(() => {
      currentTime.value = dayjs().format('HH:mm:ss')
    }, 1000)
  }

  const stopGenerateCurrentTime = () => {
    if (currentTime.value) clearTimeout(currentTime.value)
  }

  /**
   * @description: 开启操作超时倒计时
   * @return {*}
   */
  const openOperationTimeoutCountdown = () => {
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

  const closeOperationTimeoutCountdown = () => {
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
  const resetOperationTimeoutCountdown = (time = OPERATION_TIMEOUT) => {
    operationTimeout.value = time
  }

  /**
   * @description: 开启确认超时倒计时
   * @return {*}
   */
  const openConfirmationTimeCountdown = () => {
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
      } else {
        router.replace('/')
      }
    }, 1000)
  }
  const closeConfirmationTimeCountdown = () => {
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
  const resetConfirmationTimeCountdown = (time = CONFIRM_TIMEOUT) => {
    confirmTimeout.value = time
  }

  /**
   * @description: 重置所有倒计时
   * @return {*}
   */
  const resetCountdowns = () => {
    resetOperationTimeoutCountdown()
    resetConfirmationTimeCountdown()
  }

  return {
    currentTime,
    operationTimeout,
    operationTimeoutVisible,
    confirmTimeout,
    confirmTimeoutVisible,
    startGenerateCurrentTime,
    stopGenerateCurrentTime,
    openOperationTimeoutCountdown,
    closeOperationTimeoutCountdown,
    resetOperationTimeoutCountdown,
    openConfirmationTimeCountdown,
    closeConfirmationTimeCountdown,
    resetConfirmationTimeCountdown,
    resetCountdowns
  }
}
