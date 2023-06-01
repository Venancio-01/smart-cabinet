import { useStore } from '@/store'
import BgImg from '@/public/background/index.png'

export default function () {
  const store = useStore()
  const { setDepartmentList, setUserList, setRoleList, setPermissionList, setBackgroundUrl } = store
  const { user } = storeToRefs(store)

  const getUserData = async (userId: number) => {
    const data = await window.JSBridge.sys.getUserData(userId)
    return data
  }

  const getUserList = async () => {
    const list = await window.JSBridge.sys.getAllUsers()
    setUserList(list)
    return list
  }

  const getUsersByCondition = async (params: UserQueryProps) => {
    const list = await window.JSBridge.sys.getUsersByCondition({ ...params })
    return list
  }

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.getDepartmentData()
    setDepartmentList(departments)
    return departments
  }

  const getDepartmentsByCondition = async (params: UserQueryProps) => {
    const list = await window.JSBridge.sys.getDepartmentsByCondition({
      ...params,
    })
    return list
  }

  const getRoleList = async () => {
    const roleList = await window.JSBridge.sys.getRoleData()
    setRoleList(roleList)
    return roleList
  }

  const getPermissionList = async () => {
    const permissionList = await window.JSBridge.sys.getPermissionData()
    setPermissionList(permissionList)
    return permissionList
  }

  const updateUserPassword = async (password: string) => {
    const userId = user.value?.id
    if (userId === undefined)
      return false

    const success = await window.JSBridge.sys.updatePassword(userId, password)
    return success
  }

  const verifyPassword = async (password: string) => {
    if (user.value === null)
      return false

    const success = await window.JSBridge.sys.verifyPassword(JSON.stringify(user.value), password)
    return success
  }

  const verifyFinger = async (userId: number) => {
    if (user.value === null)
      return false

    return user.value.id === userId
  }

  const verifyCard = async (cardNumber: string) => {
    if (user.value === null)
      return false

    const success = await window.JSBridge.sys.verifyCard(JSON.stringify(user.value), cardNumber)
    return success
  }

  const getBackgroundImage = async () => {
    const path = import.meta.env.DEV ? BgImg : await window.JSBridge.sys.getProductionBgImagePath()
    setBackgroundUrl(path)
  }

  const init = async () => {
    getUserList()
    getDepartmentList()
    getRoleList()
    getPermissionList()
  }

  return {
    init,
    getUserData,
    getUserList,
    getUsersByCondition,
    getDepartmentList,
    getDepartmentsByCondition,
    updateUserPassword,
    verifyPassword,
    verifyFinger,
    verifyCard,
    getBackgroundImage,
  }
}
