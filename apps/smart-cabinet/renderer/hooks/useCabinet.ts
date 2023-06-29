import { CHECK_TIME } from 'utils/config/renderer'
import useLock from './useLock'
import { useStore } from '@/store'

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setCurrentCabinet, setCabinetDoorList, setCabinetDoor, addLastOperationCabinetDoorRecords } = store
  const { isLockControlConnected, currentCabinet } = storeToRefs(store)
  const { openLock } = useLock()

  /**
   * @description: 获取柜体信息
   * @return {*}
   */
  const getCurrentCabinet = async () => {
    const data = await window.JSBridge.cabinet.getCurrentCabinet()
    console.log('🚀 ~ file: useCabinet.ts:18 ~ getCurrentCabinet ~ data:', data)
    setCurrentCabinet(data)
  }

  /**
   * @description: 获取柜门信息
   * @return {*}
   */
  const getCabinetDoors = async () => {
    const cabinetDoorList = await window.JSBridge.cabinet.selectRfidCabinetDoorList({
      cabinetId: currentCabinet.value?.id,
    })
    console.log('🚀 ~ file: useCabinet.ts:29 ~ getCabinetDoors ~ cabinetDoorList:', cabinetDoorList)
    const list: CabinetDoorProps[] = cabinetDoorList.map((item) => {
      return {
        ...item,
        isOpen: false,
        rfidIsConnected: false,
        checkCountdown: CHECK_TIME,
      }
    })

    setCabinetDoorList(list)
  }

  // 打开柜门
  const openCabinetDoor = async (door: CabinetDoorProps) => {
    if (isLockControlConnected && door.kgbh) {
      openLock(door.kgbh)
      addLastOperationCabinetDoorRecords(door)

      setTimeout(() => {
        setCabinetDoor({ ...door, isOpen: true })
      }, 1000)
    }

    router.push(`/open/${door?.id}`)
  }

  const initCabinetData = async () => {
    await getCurrentCabinet()
    if (currentCabinet) await getCabinetDoors()
  }

  return {
    getCabinetDoors,
    initCabinetData,
    openCabinetDoor,
  }
}
