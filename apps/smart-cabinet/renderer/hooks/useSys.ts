import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { setDepartmentList, setUserList, setRoleList } = store

  const getUserList = async () => {
    const list = await window.JSBridge.sys.selectSysUserList()
    setUserList(list)
  }

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.selectSysDeptList()
    setDepartmentList(departments)
  }

  const getRoleList = async () => {
    const roleList = await window.JSBridge.sys.selectSysRoleList()
    setRoleList(roleList)
  }

  const init = async () => {
    getUserList()
    getDepartmentList()
    getRoleList()
  }

  return {
    init,
    getDepartmentList,
  }
}
