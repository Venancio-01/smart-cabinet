import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { saveDepartmentList } = store
  const { user } = storeToRefs(store)

  const getUserData = async (userId: number) => {
    const data = await window.JSBridge.sys.getUserData(userId)
    return data
  }

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.getDepartmentData()
    saveDepartmentList(departments)
    return departments
  }

  const updateUserPassword = async (password: string) => {
    const success = await window.JSBridge.sys.updatePassword(user.value?.USER_ID, password)
    return success
  }

  return {
    getUserData,
    getDepartmentList,
    updateUserPassword
  }
}
