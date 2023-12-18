import router from '@/router'

/**
 * @description: 软件启动时校验激活码
 * @return {*}
 */
export async function checkActivationCode(): Promise<void> {
  const localActivationCode = await window.electronApi.ipcRenderer.invoke('store:get', 'activationCode')
  const result = await window.electronApi.ipcRenderer.invoke('activation:compare-activation-code', localActivationCode)
  if (localActivationCode === '' || !result) router.replace('/activate')
}
