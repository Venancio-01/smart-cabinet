import { QUERY_OPEN_STATE_INTERVAL, SEND_QUERY_COMMAND_INTERVAL } from 'utils/config/renderer'
import useCheck from './useCheck'
import useCarrier from './useCarrier'
import { useStore } from '@/store'

// 查询锁孔开启状态的定时器
const queryLockOpenStatusTimer = ref<number | null>(null)
// 查询所有锁控状态的定时器
const queryAllLockTimer = ref<number | null>(null)

export default function () {
  const store = useStore()
  const { setLockControlConnectionStatus, setLockControlState, setCabinetDoor, addLastOperationCabinetDoorRecords } = store
  const { currentCabinet, cabinetDoorList, lockControlState, isLockControlConnected } = storeToRefs(store)
  const { handleCheck } = useCheck()
  const { recordDataWhenCheckStart } = useCarrier()

  // 获取锁控板连接状态
  const getLockControlConnectState = async () => {
    const isConnected = await window.JSBridge.lockControl.getConnectState()
    setLockControlConnectionStatus(isConnected)
  }

  // 初始化锁控板连接
  const initLockControl = async () => {
    if (currentCabinet.value === null) return

    const { openDoor } = currentCabinet.value
    if (openDoor === null) return

    await window.JSBridge.lockControl.init(openDoor, 9600)
  }

  // 打开某个锁
  const openLock = (lockNumber: number | string) => {
    const boardAddress = '01'
    const lockAddress = String(lockNumber).padStart(2, '0')
    window.JSBridge.lockControl.open(boardAddress, lockAddress)
  }

  // 门锁开启状态
  const queryLockOpenStatus = async () => {
    const result = await window.JSBridge.lockControl.getOpenStatus()
    setLockControlState(result)
  }

  const pollingQueryLockOpenStatus = () => {
    queryLockOpenStatus()
    queryLockOpenStatusTimer.value = window.setInterval(queryLockOpenStatus, QUERY_OPEN_STATE_INTERVAL)
  }

  const stopPollingQueryLockOpenStatus = () => {
    if (queryLockOpenStatusTimer.value) window.clearInterval(queryLockOpenStatusTimer.value)
  }

  // 查询所有锁状态
  const queryAllLockState = async () => {
    await window.JSBridge.lockControl.queryAllState()
  }

  // 轮询查询所有锁状态
  const pollingQueryAllLockState = () => {
    queryAllLockState()
    queryAllLockTimer.value = window.setInterval(() => {
      queryAllLockState()
    }, SEND_QUERY_COMMAND_INTERVAL)
  }

  // 停止轮询查询所有锁状态
  const stopPollingQueryAllLockState = () => {
    if (queryAllLockTimer.value) clearInterval(queryAllLockTimer.value)
  }

  const watchLockControlState = () => {
    watch(lockControlState, (value) => {
      if (value === null) return

      cabinetDoorList.value.forEach((door) => {
        const isOpen = value[door.kgbh]

        if (door.isOpen && !isOpen && door.checkCountdown === 10) {
          console.log(`${door.kgbh} - 门锁关闭`)

          // 记录最后一次操作的柜门
          addLastOperationCabinetDoorRecords(door)

          // 记录盘点开始时的载体数据
          recordDataWhenCheckStart()
          handleCheck(door.id)
          setCabinetDoor({ ...door, isOpen: false })
        } else if (isOpen) {
          console.log(`${door.kgbh} - 门锁开启`)
          setCabinetDoor({ ...door, isOpen: true })
        }
      })
    })
  }

  const initLockControlService = async () => {
    await getLockControlConnectState()
    if (!isLockControlConnected.value) return
    // 连接锁控板
    initLockControl()
    // 轮询发送锁控板查询状态的命令
    pollingQueryLockOpenStatus()
    // 轮询发送查询锁控状态的命令
    pollingQueryAllLockState()
    // 监听锁控板状态
    watchLockControlState()
  }

  const destroyLockControlService = () => {
    stopPollingQueryLockOpenStatus()
    stopPollingQueryAllLockState()
  }

  return {
    openLock,
    initLockControlService,
    destroyLockControlService,
  }
}
