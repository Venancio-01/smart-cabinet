import { setAntdConfig } from 'ui'
import useSys from '@/hooks/useSys'
import useDoor from '@/hooks/useDoor'
import useRfid from '@/hooks/useRfid'
import useNetwork from '@/hooks/useNetwork'
import { checkActivationCode } from '@/features/activation'

export default function () {
  // 配置 Antd 主题
  setAntdConfig()

  const { getNetworkConnectionStatus } = useNetwork()
  const { initSysData } = useSys()
  const { getRfidConnectionStatus, regsterAlarmsListener } = useRfid()
  const { init: initAccessDoor } = useDoor()

  onMounted(async () => {
    // 软件启动时校验激活码
    checkActivationCode()
    // 获取数据库连接状态
    getNetworkConnectionStatus()
    // 初始化系统数据
    initSysData()
    initAccessDoor()
    getRfidConnectionStatus()
    regsterAlarmsListener()
  })
}
