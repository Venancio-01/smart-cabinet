import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import ipcNames from '#/ipcNames'
import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setDepartmentList } = store

  const getDepartmentList = async () => {
    const departments = await rendererInvoke(ipcNames.sys.selectSysDeptList)
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
