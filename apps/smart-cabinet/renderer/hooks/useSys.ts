import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setDepartmentList, setUserList, setRoleList } = store

  const getUserList = async () => {
    const list = await window.electronApi.ipcRenderer.invoke('sys:select-sys-user-list')
    setUserList(list)
  }

  const getDepartmentList = async () => {
    const departments = await window.electronApi.ipcRenderer.invoke('sys:select-sys-dept-list')
    setDepartmentList(departments)
  }

  const getRoleList = async () => {
    const roleList = await window.electronApi.ipcRenderer.invoke('sys:select-sys-role-list')
    setRoleList(roleList)
  }

  const initSysData = async () => {
    getUserList()
    getDepartmentList()
    getRoleList()
  }

  return {
    initSysData,
  }
}
