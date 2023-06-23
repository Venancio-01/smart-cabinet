import { useStore } from '@/store'
import BgImg from '@/public/background/index.png'

export default function () {
  const store = useStore()
  const { setBackgroundUrl, setDepartmentList } = store

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

  const getBackgroundImage = async () => {
    const path = import.meta.env.DEV ? BgImg : await window.JSBridge.sys.getProductionBgImagePath()
    setBackgroundUrl(path)
  }

  const initSysData = async () => {
    getBackgroundImage()
    getDepartmentList()
  }

  return {
    initSysData,
    getDepartmentsByCondition,
    getDepartmentList,
    getBackgroundImage,
  }
}
