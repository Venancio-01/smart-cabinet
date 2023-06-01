export default () => {
  const router = useRouter()

  const getLocalActivationCode = async (): Promise<string | null> => {
    const code = await window.JSBridge.store.get('activationCode')
    return code
  }

  const getDeskId = async (): Promise<string> => {
    const id = await window.JSBridge.encryption.getDeskId()
    return id
  }

  const encrypt = async (data: string): Promise<string> => {
    const encrypted = await window.JSBridge.encryption.encrypt(data)
    return encrypted
  }

  /**
   * @description: 生成注册码
   * @return {*}
   */
  const generateRegistrationCode = async (): Promise<string> => {
    const id = await getDeskId()
    const encrypted = encrypt(id)
    return encrypted
  }

  /**
   * @description: 生成激活码
   * @return {*}
   */
  const generateActivationCode = async (): Promise<string> => {
    const registrationCode = await generateRegistrationCode()
    const activationCode = encrypt(registrationCode)
    return activationCode
  }

  /**
   * @description: 比对激活码
   * @return {*}
   */
  const compareActivationCode = async (activationCode: string): Promise<boolean> => {
    const id = await getDeskId()
    const encrypted = await encrypt(await encrypt(id))
    return activationCode === encrypted
  }

  /**
   * @description: 保存激活码到本地
   * @return {*}
   */
  const saveActivationCode: (activationCode: string) => Promise<void> = async (activationCode: string) => {
    window.JSBridge.store.set('activationCode', activationCode)
  }

  /**
   * @description: 软件启动时校验激活码
   * @return {*}
   */
  const checkActivationCode = async (): Promise<void> => {
    const activationCode = await getLocalActivationCode()
    if (!activationCode) {
      router.replace('/activate')
      return
    }

    const result = await compareActivationCode(activationCode)
    if (!result)
      router.replace('/activate')
  }

  // 应用启动读取 store 里的激活码，如果没有则生成注册码，页面跳转到注册页面，如果有则校验激活码，如果激活码校验成功则跳转到登录页面，如果激活码校验失败则跳转到注册页面
  // 用户输入激活码，点击激活，激活成功后跳转到登录页面，并把激活码保存在本地，激活失败则提示用户

  return {
    generateRegistrationCode,
    generateActivationCode,
    saveActivationCode,
    checkActivationCode,
  }
}
