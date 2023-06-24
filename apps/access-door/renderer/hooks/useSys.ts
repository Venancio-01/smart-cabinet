import { useStore } from '@/store'
import BgImg from '@/public/background/index.png'

export default function () {
  const store = useStore()
  const { setBackgroundUrl, setDepartmentList } = store

  const getDepartmentList = async () => {
    const departments = await window.JSBridge.sys.selectSysDeptList()
    setDepartmentList(departments)
    return departments
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
    getDepartmentList,
    getBackgroundImage,
  }
}
