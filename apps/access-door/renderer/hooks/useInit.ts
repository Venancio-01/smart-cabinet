import { setAntdConfig } from 'ui'
import useSys from '@/hooks/useSys'
import useDoor from '@/hooks/useDoor'
import useRfid from '@/hooks/useRfid'
import useNetwork from '@/hooks/useNetwork'
import { checkActivationCode } from '@/features/activation'

export default function () {
  // 配置 Antd 主题
  setAntdConfig()

  const { initSysData } = useSys()
  const { initAccessDoorData } = useDoor()
  const { startGetNetworkConnectionStatus, stopGetNetworkConnectionStatus } = useNetwork()
  const { startGetRfidConnectionStatus, stopGetRfidConnectionStatus, regsterAlarmsListener } = useRfid()

  onMounted(async () => {
    // 软件启动时校验激活码
    checkActivationCode()
    // 初始化系统数据
    initSysData()
    startGetNetworkConnectionStatus()
    regsterAlarmsListener()
    await initAccessDoorData()
    startGetRfidConnectionStatus()
  })

  onUnmounted(() => {
    stopGetRfidConnectionStatus()
    stopGetNetworkConnectionStatus()
  })
}
