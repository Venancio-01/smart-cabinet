import useSys from './useSys'
import useFinger from './useFinger'
import useCarrier from '@/hooks/useCarrier'
import useRfid from '@/hooks/useRfid'
import useLock from '@/hooks/useLock'
import useTime from '@/hooks/useTime'
import useCabinet from '@/hooks/useCabinet'
import useNetwork from '@/hooks/useNetwork'

// import useUpdate from './useUpdate'
import { setAntdConfig } from '@/design/antd'

export default function () {
  // 配置 Antd 主题
  setAntdConfig()
  useNetwork()
  const { init: initSys, getBackgroundImage } = useSys()
  const { getRfidConnectState } = useRfid()
  const { initLockControlService, destroyLockControlService } = useLock()
  const { startGenerateCurrentTime, stopGenerateCurrentTime } = useTime()
  const { getMisPlaceCarriers, getCarriers } = useCarrier()
  const { initCabinetData } = useCabinet()
  const { init: initFinger } = useFinger()

  onMounted(async () => {
    initFinger()
    // 获取背景图片路径
    getBackgroundImage()
    await Promise.all([initSys(), initCabinetData()])
    initLockControlService()
    // 获取 rfid 读取器连接状态
    getRfidConnectState()
    // 查询错放文档
    getMisPlaceCarriers()
    // 生成当前时间
    startGenerateCurrentTime()
    getCarriers()
  })

  onBeforeUnmount(() => {
    destroyLockControlService()
    stopGenerateCurrentTime()
  })
}
