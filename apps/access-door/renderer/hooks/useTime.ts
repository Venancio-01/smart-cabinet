import dayjs from 'dayjs'

const currentTime = ref<string | null>(null)
const currentTimeTimer = ref<number | null>(null)

export default function () {
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
    if (currentTimeTimer.value)
      clearTimeout(currentTimeTimer.value)
  }

  return {
    currentTime,
    startGenerateCurrentTime,
    stopGenerateCurrentTime,
  }
}
