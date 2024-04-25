import { useStore } from '@/store'

const TIME = 60
const operationTimeoutCountdown = ref(TIME)

export default function () {
  let timer: number | null = null

  const router = useRouter()
  const store = useStore()
  const { setActiveEquipmentList } = store

  function handleClearInterval() {
    timer && window.clearInterval(timer)
  }

  function resetCountdown() {
    operationTimeoutCountdown.value = TIME
  }

  function startMountHook() {
    onMounted(() => {
      window.addEventListener('click', resetCountdown)

      timer = window.setInterval(() => {
        operationTimeoutCountdown.value--
        if (operationTimeoutCountdown.value <= 0) {
          handleClearInterval()
          setActiveEquipmentList([])
          router.replace('/')
        }
      }, 1000)
    })

    onUnmounted(() => {
      window.removeEventListener('click', resetCountdown)
      handleClearInterval()
    })
  }

  return { operationTimeoutCountdown, resetCountdown, startMountHook }
}
