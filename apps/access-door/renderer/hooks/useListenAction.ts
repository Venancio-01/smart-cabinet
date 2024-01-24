export default function (time?: number) {
  const TIME = time || 60
  let timer: number | null = null
  const router = useRouter()
  const operationTimeoutCountdown = ref(TIME)

  function handleListenUserAction() {
    operationTimeoutCountdown.value = TIME
  }

  function handleClearInterval() {
    timer && window.clearInterval(timer)
  }

  onMounted(() => {
    window.addEventListener('click', handleListenUserAction)

    timer = window.setInterval(() => {
      operationTimeoutCountdown.value--
      if (operationTimeoutCountdown.value <= 0) {
        handleClearInterval()
        router.replace('/')
      }
    }, 1000)
  })

  onUnmounted(() => {
    window.removeEventListener('click', handleListenUserAction)
    handleClearInterval()
  })

  return { operationTimeoutCountdown }
}
