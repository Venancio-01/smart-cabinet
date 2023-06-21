import { useStore } from '@/store'
import MainBackground from '@/public/background/index.png'

export async function getDepartmentList() {
  const store = useStore()

  const departments = await window.JSBridge.sys.getDepartmentData()
  store.setDepartmentList(departments)
  return departments
}

export function getDepartmentsByCondition(params: UserQueryProps) {
  return window.JSBridge.sys.getDepartmentsByCondition({
    ...params,
  })
}

export async function getBackgroundImage() {
  const store = useStore()

  const path = import.meta.env.DEV ? MainBackground : await window.JSBridge.sys.getProductionBgImagePath()
  store.setBackgroundUrl(path)
}

export async function initSysData() {
  getBackgroundImage()
  getDepartmentList()
}
