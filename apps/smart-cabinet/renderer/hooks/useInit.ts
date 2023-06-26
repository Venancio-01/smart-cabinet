import { setAntdConfig } from 'ui'
import useSys from '@/hooks/useSys'
import useFinger from '@/hooks/useFinger'
import useCarrier from '@/hooks/useCarrier'
import useRfid from '@/hooks/useRfid'
import useLock from '@/hooks/useLock'
import useTime from '@/hooks/useTime'
import useCabinet from '@/hooks/useCabinet'
import useNetwork from '@/hooks/useNetwork'
import { checkActivationCode } from '@/features/activation'

// import useUpdate from './useUpdate'

export default function () {
  // 配置 Antd 主题
  setAntdConfig()
  useNetwork()
  const { init: initSys } = useSys()
  const { getConnectState: getRfidConnectState } = useRfid()
  const { initLockControlService, destroyLockControlService } = useLock()
  const { startGenerateCurrentTime, stopGenerateCurrentTime } = useTime()
  const { init: initCarrierData } = useCarrier()
  const { initCabinetData } = useCabinet()
  const { init: initFinger, getConnectStatus: getFingerConnectStatus } = useFinger()

  onMounted(async () => {
    // 软件启动时校验激活码
    checkActivationCode()
    await Promise.all([initSys(), initCabinetData()])
    await initCarrierData()
    initFinger()
    getFingerConnectStatus()
    initLockControlService()
    // 获取 rfid 读取器连接状态
    getRfidConnectState()
    // 查询错放文档
    // 生成当前时间
    startGenerateCurrentTime()
  })

  onBeforeUnmount(() => {
    destroyLockControlService()
    stopGenerateCurrentTime()
  })
}
