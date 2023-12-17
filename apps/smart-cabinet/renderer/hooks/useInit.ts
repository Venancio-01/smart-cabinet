import useSys from '@/hooks/useSys'
import useCarrier from '@/hooks/useCarrier'
import useRfid from '@/hooks/useRfid'
import useLock from '@/hooks/useLock'
import useCabinet from '@/hooks/useCabinet'
import useNetwork from '@/hooks/useNetwork'
import { checkActivationCode } from '@/features/activation'

// import useUpdate from './useUpdate'

export default function () {
  const { getNetworkConnectStatus } = useNetwork()
  const { initSysData } = useSys()
  const { getRfidConnectionStatus } = useRfid()
  const { initLockControlService, destroyLockControlService } = useLock()
  const { initCarrierData } = useCarrier()
  const { initCabinetData } = useCabinet()

  onMounted(async () => {
    // 软件启动时校验激活码
    checkActivationCode()
    getNetworkConnectStatus()
    await Promise.all([initSysData(), initCabinetData()])
    await initCarrierData()
    getRfidConnectionStatus()
    initLockControlService()
  })

  onBeforeUnmount(() => {
    destroyLockControlService()
  })
}
