import BgImg from '@/public/background/index.png'

export async function getBackgroundImage() {
  const path = import.meta.env.DEV ? BgImg : await window.JSBridge.sys.getProductionBgImagePath()
  return path
}
