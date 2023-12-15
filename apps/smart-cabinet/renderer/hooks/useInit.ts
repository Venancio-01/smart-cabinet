import { setAntdConfig } from '@smart-cabinet/ui'
import useSys from '@/hooks/useSys'
import useFinger from '@/hooks/useFinger'
import useCarrier from '@/hooks/useCarrier'
import useRfid from '@/hooks/useRfid'
import useLock from '@/hooks/useLock'
import useCabinet from '@/hooks/useCabinet'
import useNetwork from '@/hooks/useNetwork'
import { checkActivationCode } from '@/features/activation'

// import useUpdate from './useUpdate'

export default function () {
  // 配置 Antd 主题
  setAntdConfig()
  const { getNetworkConnectStatus } = useNetwork()
  const { initSysData } = useSys()
  const { getRFIDConnectionStatus } = useRfid()
  const { initLockControlService, destroyLockControlService } = useLock()
  const { initCarrierData } = useCarrier()
  const { initCabinetData } = useCabinet()
  const { initFinger, getFingerConnectionStatus } = useFinger()

  onMounted(async () => {
    // 软件启动时校验激活码
    checkActivationCode()
    getNetworkConnectStatus()
    initFinger()
    getFingerConnectionStatus()
    await Promise.all([initSysData(), initCabinetData()])
    await initCarrierData()
    getRFIDConnectionStatus()
    initLockControlService()
  })

  onBeforeUnmount(() => {
    destroyLockControlService()
  })
}
