import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import ipcNames from '#/ipcNames'
import BgImg from '@/public/background/index.png'

export async function getBackgroundImage() {
  const path = import.meta.env.DEV ? BgImg : await rendererInvoke(ipcNames.sys.getProductionBgImagePath)

  return path
}
