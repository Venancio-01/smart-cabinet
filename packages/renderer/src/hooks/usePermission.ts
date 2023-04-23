import { useStore } from '@/store'

export default function usePermission() {
  const store = useStore()
  const { currentUserPermissionList } = storeToRefs(store)

  const hasPermission = (permission: string): boolean => {
    // Get the values of the permissions that the current user has.
    const values = currentUserPermissionList.value.map(item => item.value) as string[]
    // Check if the permissions include the permission that we are checking for.
    const result = values.includes(permission)
    return result
  }

  return {
    hasPermission
  }
}
