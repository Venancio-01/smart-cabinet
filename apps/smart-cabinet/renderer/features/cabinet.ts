import { CHECK_TIME } from '@smart-cabinet/utils/config/renderer'
import { openLock } from '@/features/lock-control'
import { useGlobalState } from '@/store'
import router from '@/router'

const { setCurrentCabinet, setCabinetDoorList, setCabinetDoor, addLastOperationCabinetDoorRecords } = useGlobalState()
const { isLockControlConnected, currentCabinet } = useGlobalState()
/**
 * @description: 获取当前柜体信息
 * @return {*}
 */
export async function getCurrentCabinet() {
  const data = await window.electronApi.ipcRenderer.invoke('cabinet:get-current-cabinet')
  data && setCurrentCabinet(data)
}

/**
 * @description: 获取柜门列表
 * @return {*}
 */
export async function getCabinetDoorList() {
  const cabinetDoorList = await window.electronApi.ipcRenderer.invoke('cabinet:select-rfid-cabinet-door-list', currentCabinet.value?.id)

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
export async function openCabinetDoor(door: CabinetDoorProps) {
  if (isLockControlConnected && door.kgbh) {
    openLock(door.kgbh)
    addLastOperationCabinetDoorRecords(door)

    setTimeout(() => {
      setCabinetDoor({ ...door, isOpen: true })
    }, 1000)
  }

  router.push(`/open/${door?.id}`)
}

export async function initCabinetData() {
  await getCurrentCabinet()
  if (currentCabinet) await getCabinetDoorList()
}
