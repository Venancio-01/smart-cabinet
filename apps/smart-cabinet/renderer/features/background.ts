import BgImg from '@/public/background/index.png'

export async function getBackgroundImage() {
  const path = import.meta.env.DEV ? BgImg : await window.electronApi.ipcRenderer.invoke('sys:get-production-bg-image-path')
  return path
}
