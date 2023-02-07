import useDocument from '@/hooks/useDocument'
import useRfid from '@/hooks/useRfid'
import useLock from '@/hooks/useLock'
import useFinger from '@/hooks/useFinger'
import useTime from '@/hooks/useTime'
import useCabinet from '@/hooks/useCabinet'
import useNetwork from '@/hooks/useNetwork'
import useUser from './useUser'
import useCheck from './useCheck'

export default function () {
  useNetwork()
  const { getDepartmentList } = useUser()
  const { getRfidConnectState } = useRfid()
  const {
    getLockControlConnectState,
    initLockControl,
    pollingQueryLockOpenStatus,
    stopPollingQueryLockOpenStatus,
    pollingQueryAllLockState,
    stopPollingQueryAllLockState
  } = useLock()
  const { startGenerateCurrentTime, stopGenerateCurrentTime, startWatchLoginState } = useTime()
  const { pollingGetFingerStatus, stopPollingGetFingerStatus } = useFinger()
  const { getMisPlaceDocuments } = useDocument()
  const { getCabinetInfo, getCabinetDoorInfo } = useCabinet()
  const { watchLockControlState } = useCheck()

  onMounted(async () => {
    // 监听锁控板状态
    watchLockControlState()
    // 获取部门信息
    getDepartmentList()
    // 获取柜体信息
    getCabinetInfo()
    // 获取柜门信息
    await getCabinetDoorInfo()
    // 获取锁控板连接状态
    await getLockControlConnectState()
    // 获取 rfid 读取器连接状态
    getRfidConnectState()
    // 连接锁控板
    initLockControl()
    // 查询错放文档
    getMisPlaceDocuments()
    // 轮询发送锁控板查询状态的命令
    pollingQueryLockOpenStatus()
    // 查询指纹仪连接状态
    pollingGetFingerStatus()
    // 轮询发送查询锁控状态的命令
    pollingQueryAllLockState()
    // 生成当前时间
    startGenerateCurrentTime()
    startWatchLoginState()
  })

  onBeforeUnmount(() => {
    stopPollingQueryLockOpenStatus()
    stopPollingGetFingerStatus()
    stopPollingQueryAllLockState()
    stopGenerateCurrentTime()
  })
}
