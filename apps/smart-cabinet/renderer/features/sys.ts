import { useGlobalState } from '@/store'

const { setDepartmentList, setUserList, setRoleList } = useGlobalState()

export async function getUserList() {
  const list = await window.electronApi.ipcRenderer.invoke('sys:select-sys-user-list')
  setUserList(list)
}

export async function getDepartmentList() {
  const departments = await window.electronApi.ipcRenderer.invoke('sys:select-sys-dept-list')
  setDepartmentList(departments)
}

export async function getRoleList() {
  const roleList = await window.electronApi.ipcRenderer.invoke('sys:select-sys-role-list')
  setRoleList(roleList)
}

export async function initSysData() {
  getUserList()
  getDepartmentList()
  getRoleList()
}
