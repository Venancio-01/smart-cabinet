import dayjs from 'dayjs'
import { useStore } from '@/store'

const currentTime = ref<string | null>(null)
const currentTimeTimer = ref<number | null>(null)
const currentTimeVisible = ref(false)

export default function () {
  const store = useStore()
  const { changeOperationTimeout, changeIsLoggedIn, resetOperationTimeout } = store
  const { isLoggedIn, operationTimeout } = storeToRefs(store)

  const startGenerateCurrentTime = () => {
    currentTimeTimer.value = window.setInterval(() => {
      currentTime.value = dayjs().format('HH:mm:ss')
    }, 1000)
  }

  const stopGenerateCurrentTime = () => {
    if (currentTime.value) clearTimeout(currentTime.value)
  }

  const generateCurrentTime = () => {
    return dayjs().format('HH:mm:ss')
  }

  const startWatchLoginState = () => {
    const timer = ref<null | number>(null)
    watch(isLoggedIn, value => {
      if (value) {
        currentTimeVisible.value = true
        timer.value = window.setInterval(() => {
          changeOperationTimeout(operationTimeout.value - 1)

          if (operationTimeout.value === 0) {
            changeIsLoggedIn(false)
          }
        }, 1000)
      } else {
        currentTimeVisible.value = false
        resetOperationTimeout()
        if (timer.value) {
          clearInterval(timer.value)
        }
      }
    })
  }

  return {
    currentTime,
    currentTimeVisible,
    generateCurrentTime,
    startGenerateCurrentTime,
    stopGenerateCurrentTime,
    startWatchLoginState
  }
}
