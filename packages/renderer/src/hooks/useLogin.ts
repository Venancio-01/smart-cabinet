import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'
import useSys from './useSys'
import { PASSWORD_KEY } from '@/config'
import useTime from '@/hooks/useTime'

export type PasswordLoginType = {
  username: string
  password: string
}

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setIsLoggedIn, setUserData, setLoginModeIndex } = store
  const { getUserData } = useSys()
  const { openOperationTimeoutCountdown, closeOperationTimeoutCountdown } = useTime()

  /**
   * @description: 登录
   * @param {UserProps} userData
   * @return {*}
   */
  const handleLogin = (userData: UserProps) => {
    setIsLoggedIn(true)
    setLoginModeIndex(PASSWORD_KEY)
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
    const result = await window.JSBridge.login.onPasswordLogin({ ...formData })
    if (result.success) {
      handleLogin(result.data)
    } else {
      createAlert(result.msg || '')
      return
    }
  }

  const handleFingerLogin = async (userId: number) => {
    const user = await getUserData(userId)
    handleLogin(user)
  }

  const handleCardLogin = async (cardNumber: string) => {
    if (cardNumber === '') {
      createAlert('刷卡登录失败')
      return
    }

    const result = await window.JSBridge.login.onCardLogin(cardNumber)
    if (result.success) {
      handleLogin(result.data)
    } else {
      createAlert(result.msg || '')
      return
    }
  }

  return {
    handleLogin,
    handleLogout,
    handlePasswordLogin,
    handleFingerLogin,
    handleCardLogin
  }
}
