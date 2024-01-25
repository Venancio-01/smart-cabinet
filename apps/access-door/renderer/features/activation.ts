import { rendererInvoke } from '@smart-cabinet/utils/renderer'

/**
 * @description: 软件启动时校验激活码
 * @return {*}
 */
export async function checkActivationCode(): Promise<void> {
  const router = useRouter()

  // const localActivationCode = await window.electronApi.ipcRenderer.invoke('store:get', 'activationCode')
  const localActivationCode = await rendererInvoke('store:get', 'activationCode')
  const isSame = await rendererInvoke('sys:compare-activation-code')
  if (!localActivationCode || !isSame) router.replace('/activate')
}
