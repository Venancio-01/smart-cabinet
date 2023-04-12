import useDocument from '@/hooks/useDocument'
import useRfid from '@/hooks/useRfid'
import useLock from '@/hooks/useLock'
import useTime from '@/hooks/useTime'
import useCabinet from '@/hooks/useCabinet'
import useNetwork from '@/hooks/useNetwork'
import useSys from './useSys'
import useUpdate from './useUpdate'
import useFinger from './useFinger'

export default function () {
  useNetwork()
  const { getDepartmentList, getUserList, getBackgroundImage } = useSys()
  const { getRfidConnectState } = useRfid()
  const { initLockControlService, destroyLockControlService } = useLock()
  const { startGenerateCurrentTime, stopGenerateCurrentTime } = useTime()
  const { getMisPlaceDocuments, getAllDocumentData } = useDocument()
  const { getCabinetInfo, getCabinetDoorInfo } = useCabinet()
  const { initUpdateService, destroyUpdateService } = useUpdate()
  const { initSDK } = useFinger()

  onMounted(async () => {
    initUpdateService()
    initSDK()
    // 获取背景图片路径
    getBackgroundImage()
    // 获取部门信息
    getDepartmentList()
    // 获取用户列表
    getUserList()
    // 获取柜体信息
    getCabinetInfo()
    // 获取柜门信息
    await getCabinetDoorInfo()
    initLockControlService()
    // 获取 rfid 读取器连接状态
    getRfidConnectState()
    // 查询错放文档
    getMisPlaceDocuments()
    // 生成当前时间
    startGenerateCurrentTime()
    getAllDocumentData()
  })

  onBeforeUnmount(() => {
    destroyUpdateService()
    destroyLockControlService()
    stopGenerateCurrentTime()
  })
}
