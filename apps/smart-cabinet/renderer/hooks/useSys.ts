import { useStore } from '@/store'
import BgImg from '@/public/background/index.png'

export default function () {
  const store = useStore()
  const { setDepartmentList, setUserList, setRoleList, setUserRoleList, setBackgroundUrl } = store

  const getUserData = async (userId: bigint) => {
    const data = await window.JSBridge.sys.selectSysUser({
      userId,
    })
    return data
  }

  const getUserList = async () => {
    const list = await window.JSBridge.sys.selectSysUserList()
    setUserList(list)
    return list
  }

  const getUsersByCondition = async (params: UserQueryProps) => {
    const list = await window.JSBridge.sys.getUsersByCondition({ ...params })
    return list
  }

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.selectSysDeptList()
    setDepartmentList(departments)
    return departments
  }

  const getDepartmentsByCondition = async (params: DepartmentQueryProps) => {
    const list = await window.JSBridge.sys.selectSysDeptList({
      ...params,
    })
    return list
  }

  const getRoleList = async () => {
    const roleList = await window.JSBridge.sys.selectSysRoleList()
    setRoleList(roleList)
  }

  const getUserRoleList = async () => {
    const roleList = await window.JSBridge.sys.selectSysUserRoleList()
    setUserRoleList(roleList)
  }

  const getBackgroundImage = async () => {
    const path = import.meta.env.DEV ? BgImg : await window.JSBridge.sys.getProductionBgImagePath()
    setBackgroundUrl(path)
  }

  const init = async () => {
    getUserList()
    getDepartmentList()
    getRoleList()
    getUserRoleList()
  }

  return {
    init,
    getUserData,
    getUserList,
    getUsersByCondition,
    getDepartmentList,
    getDepartmentsByCondition,
    getBackgroundImage,
  }
}
