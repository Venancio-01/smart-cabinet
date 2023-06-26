/**
 * @description: 软件启动时校验激活码
 * @return {*}
 */
export async function checkActivationCode(): Promise<void> {
  const router = useRouter()

  const localActivationCode = await window.JSBridge.store.get('activationCode')
  const result = await window.JSBridge.activation.compareActivationCode(localActivationCode)
  if (localActivationCode === '' || !result) router.replace('/activate')
}
