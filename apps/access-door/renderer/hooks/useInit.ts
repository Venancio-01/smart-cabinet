import { setAntdConfig } from 'ui'
import useSys from '@/hooks/useSys'
import useEncryption from '@/hooks/useEncryption'
import useDoor from '@/hooks/useDoor'
import useRfid from '@/hooks/useRfid'
import useTime from '@/hooks/useTime'
import useCabinet from '@/hooks/useCabinet'
import useNetwork from '@/hooks/useNetwork'

export default function () {
  // 配置 Antd 主题
  setAntdConfig()
  useNetwork()

  const { initSysData } = useSys()
  const { handleConnect, regsterAlarmsListener } = useRfid()
  const { startGenerateCurrentTime, stopGenerateCurrentTime } = useTime()
  const { initCabinetData } = useCabinet()
  const { checkActivationCode } = useEncryption()
  const { init: initAccessDoor } = useDoor()

  onMounted(async () => {
    checkActivationCode()
    // 生成当前时间
    startGenerateCurrentTime()
    // 初始化系统数据
    initSysData()
    await Promise.all([initCabinetData(), initAccessDoor()])
    // 连接 rfid 读取器
    handleConnect()
    regsterAlarmsListener()
  })

  onBeforeUnmount(() => {
    stopGenerateCurrentTime()
  })
}
