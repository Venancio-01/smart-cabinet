import { useStore } from '@/store'
import useRfid from './useRfid'

export default function () {
  const store = useStore()
  const { changeCabinetDoorData } = store
  const { cabinetDoorList, lockControlState } = storeToRefs(store)
  const { startInventory } = useRfid()

  const watchLockControlState = () => {
    watch(lockControlState, value => {
      if (value === null) return

      cabinetDoorList.value.forEach(door => {
        const isOpen = value[door.kgbh]

        if (door.isOpen && !isOpen && door.checkCountDown === 10) {
          console.log(`${door.kgbh} - 门锁关闭`)
          startInventory(door.id)
          changeCabinetDoorData({ ...door, isOpen: false })
        } else if (isOpen) {
          console.log(`${door.kgbh} - 门锁开启`)
          changeCabinetDoorData({ ...door, isOpen: true })
        }
      })
    })
  }

  return {
    watchLockControlState
  }
}
