import { QUERY_OPEN_STATE_INTERVAL, SEND_QUERY_COMMAND_INTERVAL } from '@smart-cabinet/utils/config/renderer'
import { handleCheck } from './check'

import { recordDataWhenCheckStart } from '@/features/carrier'
import { useGlobalState } from '@/store'

// 查询锁孔开启状态的定时器
const queryLockOpenStatusTimer = ref<number | null>(null)
// 查询所有锁控状态的定时器
const queryAllLockTimer = ref<number | null>(null)

const { setLockControlConnectionStatus, setLockControlState, setCabinetDoor, addLastOperationCabinetDoorRecords } = useGlobalState()
const { currentCabinet, cabinetDoorList, lockControlState, isLockControlConnected } = useGlobalState()
// 获取锁控板连接状态
export async function getLockControlConnectState() {
  const isConnected = await window.electronApi.ipcRenderer.invoke('lock-control:get-connection-state')
  setLockControlConnectionStatus(isConnected)
}

// 初始化锁控板连接
export async function initLockControl() {
  if (currentCabinet.value === null) return

  const { openDoor } = currentCabinet.value
  if (openDoor === null) return

  window.electronApi.ipcRenderer.send('lock-control:init', openDoor)
}

// 打开某个锁
export function openLock(lockNumber: number | string) {
  const boardAddress = '01'
  const lockAddress = String(lockNumber).padStart(2, '0')

  window.electronApi.ipcRenderer.send('lock-control:open', boardAddress, lockAddress)
}

// 门锁开启状态
export async function queryLockOpenStatus() {
  const result = await window.electronApi.ipcRenderer.invoke('lock-control:get-open-status')

  setLockControlState(result)
}

function pollingQueryLockOpenStatus() {
  queryLockOpenStatus()
  queryLockOpenStatusTimer.value = window.setInterval(queryLockOpenStatus, QUERY_OPEN_STATE_INTERVAL)
}

function stopPollingQueryLockOpenStatus() {
  if (queryLockOpenStatusTimer.value) window.clearInterval(queryLockOpenStatusTimer.value)
}

// 查询所有锁状态
export async function queryAllLockState() {
  window.electronApi.ipcRenderer.send('lock-control:query-all-state')
}

// 轮询查询所有锁状态
function pollingQueryAllLockState() {
  queryAllLockState()
  queryAllLockTimer.value = window.setInterval(() => {
    queryAllLockState()
  }, SEND_QUERY_COMMAND_INTERVAL)
}

// 停止轮询查询所有锁状态
function stopPollingQueryAllLockState() {
  if (queryAllLockTimer.value) clearInterval(queryAllLockTimer.value)
}

function watchLockControlState() {
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
      }
      else if (isOpen) {
        console.log(`${door.kgbh} - 门锁开启`)
        setCabinetDoor({ ...door, isOpen: true })
      }
    })
  })
}

export async function initLockControlService() {
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

export function destroyLockControlService() {
  stopPollingQueryLockOpenStatus()
  stopPollingQueryAllLockState()
}
