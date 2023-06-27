import type { SysUserProps } from 'database'
import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'
import useTime from '@/hooks/useTime'
import {v4 as uuidv4 } from 'uuid'

export interface PasswordLoginType {
  username: string
  password: string
}

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setIsLoggedIn, setUserData,setGuid } = store
  const { openOperationTimeoutCountdown, closeOperationTimeoutCountdown } = useTime()

  /**
   * @description: 登录
   * @param {UserProps} userData
   * @return {*}
   */
  const handleLogin = (userData: SysUserProps) => {
    setIsLoggedIn(true)
    setGuid(uuidv4())
    setUserData(userData)
    openOperationTimeoutCountdown()
    router.push('/main')
  }

  /**
   * @description: 登出
   * @return {*}
   */
  const handleLogout = () => {
    setIsLoggedIn(false)
    closeOperationTimeoutCountdown()
    router.push('/')
  }

  const handlePasswordLogin = async (formData: PasswordLoginType) => {
    if (formData.username === '' || formData.password === '') {
      createAlert('用户名或密码不可为空')
      return
    }
    const result = await window.JSBridge.sys.onPasswordLogin({ ...formData })
    if (result.success) handleLogin(result.data)
    else createAlert(result.msg || '')
  }

  const handleFingerLogin = async (userId: bigint) => {
    const user = await window.JSBridge.sys.selectSysUser({
      userId,
    })
    handleLogin(user)
  }

  const handleCardLogin = async (cardNumber: string) => {
    if (cardNumber === '') {
      createAlert('刷卡登录失败')
      return
    }

    const result = await window.JSBridge.sys.onCardLogin(cardNumber)
    if (result.success) handleLogin(result.data)
    else createAlert(result.msg || '')
  }

  return {
    handleLogin,
    handleLogout,
    handlePasswordLogin,
    handleFingerLogin,
    handleCardLogin,
  }
}
