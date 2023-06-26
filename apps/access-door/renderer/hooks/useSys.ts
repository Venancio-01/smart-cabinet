import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setDepartmentList } = store

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.selectSysDeptList()
    setDepartmentList(departments)
    return departments
  }

  const initSysData = async () => {
    getDepartmentList()
  }

  return {
    initSysData,
    getDepartmentList,
  }
}
