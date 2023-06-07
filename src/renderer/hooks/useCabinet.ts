import useLock from './useLock'
import useTime from './useTime'
import { CHECK_TIME } from '@/config'
import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setCurrentCabinet, setCabinetDoorList, setCabinetDoor } = store
  const { lockControlIsOnline, currentCabinet } = storeToRefs(store)
  const checkStore = useCheckStore()
  const { addLastOperationCabinetDoorRecords } = checkStore
  const { openLock } = useLock()
  const { resetOperationTimeoutCountdown } = useTime()

  /**
   * @description: 获取柜体信息
   * @return {*}
   */
  const getCurrentCabinet = async () => {
    const data = await window.JSBridge.cabinet.getCurrentCabinet()
    setCurrentCabinet(data)
  }

  /**
   * @description: 获取柜门信息
   * @return {*}
   */
  const getCabinetDoors = async () => {
    const cabinetDoors = await window.JSBridge.cabinet.getCabinetDoors()
    const list: CabinetDoorProps[] = cabinetDoors.map((item: CabinetDoorProps) => {
      return {
        ...item,
        isOpen: false,
        rfidIsConnected: false,
        checkCountdown: CHECK_TIME,
      }
    })

    console.log('🚀 ~ file: useCabinet.ts:42 ~ getCabinetDoors ~ list:', list)
    setCabinetDoorList(list)
  }

  // 打开柜门
  const openCabinetDoor = async (door: CabinetDoorProps) => {
    resetOperationTimeoutCountdown()

    if (lockControlIsOnline) {
      openLock(Number(door.Kgbh))
      addLastOperationCabinetDoorRecords(door)

      setTimeout(() => {
        setCabinetDoor({ ...door, isOpen: true })
      }, 1000)
    }

    router.push(`/open/${door.Id}`)
  }

  const initCabinetData = async () => {
    await getCurrentCabinet()
    if (!currentCabinet)
      return

    getCabinetDoors()
  }

  return {
    getCabinetDoors,
    initCabinetData,
    openCabinetDoor,
  }
}
