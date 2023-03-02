import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { saveDepartmentList, changeUserList, changeBackgroundUrl } = store
  const { user } = storeToRefs(store)

  const getUserData = async (userId: number) => {
    const data = await window.JSBridge.sys.getUserData(userId)
    return data
  }

  const getUserList = async () => {
    const list = await window.JSBridge.sys.getUserList()
    changeUserList(list)
    return list
  }

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.getDepartmentData()
    saveDepartmentList(departments)
    return departments
  }

  const updateUserPassword = async (password: string) => {
    const success = await window.JSBridge.sys.updatePassword(user.value?.id, password)
    return success
  }

  const verifyPassword = async (password: string) => {
    if (user.value === null) return false

    const success = await window.JSBridge.sys.verifyPassword({...user.value}, password)
    return success
  }

  const getBackgroundImage = async () => {
    const path = import.meta.env.DEV ? 'public/background/index.png' : await window.JSBridge.sys.getProductionBgImagePath()
    changeBackgroundUrl(path)
  }

  return {
    getUserData,
    getUserList,
    getDepartmentList,
    updateUserPassword,
    verifyPassword,
    getBackgroundImage
  }
}
