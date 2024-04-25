import { rendererInvoke } from '@smart-cabinet/utils/renderer'
import ipcNames from '#/ipcNames'

/**
 * @description: 软件启动时校验激活码
 * @return {*}
 */
export async function checkActivationCode(): Promise<void> {
  const router = useRouter()

  const localActivationCode = await rendererInvoke(ipcNames.store.get, 'activationCode')
  const isSame = await rendererInvoke(ipcNames.sys.compareActivationCode, localActivationCode)
  if (!localActivationCode || !isSame) router.replace('/activate')
}
