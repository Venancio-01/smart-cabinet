import { useStore } from '@/store'

export default function usePermission() {
  const store = useStore()
  const { isLoggedIn } = storeToRefs(store)

  const whiteList = [
    'view_carrier',
  ]

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
