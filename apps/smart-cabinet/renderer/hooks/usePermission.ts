import { useGlobalState } from '@/store'

export default function usePermission() {
  const { isLoggedIn } = useGlobalState()

  const whiteList = ['view_carrier']

  const hasPermission = (permission: string): boolean => {
    // if (!isLoggedIn.value) {
    //   const inWhiteList = !!whiteList.find(item => permission === item)
    //   if (!inWhiteList)
    //     return false
    // }

    // // Get the values of the permissions that the current user has.
    // const values = currentUserPermissionList.value.map(item => item.value) as string[]
    // // Check if the permissions include the permission that we are checking for.
    // const result = values.includes(permission)
    return true
  }

  return {
    hasPermission,
  }
}
