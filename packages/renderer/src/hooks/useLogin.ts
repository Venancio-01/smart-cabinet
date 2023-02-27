import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'
import useSys from './useSys'
import { password_KEY } from '@/config'
import useTime from '@/hooks/useTime'

export interface FormData {
  username: string
  password: string
}

export default function () {
  const router = useRouter()
  const store = useStore()
  const { changeIsLoggedIn, changeLoginVisible, saveUserData, changeLoginModeIndex } = store
  const { getUserData } = useSys()
  const { openOperationTimeoutCountdown, closeOperationTimeoutCountdown } = useTime()

  /**
   * @description: 登录
   * @param {UserProps} userData
   * @return {*}
   */
  const onLogin = (userData: UserProps) => {
    changeIsLoggedIn(true)
    changeLoginVisible(false)
    changeLoginModeIndex(password_KEY)
    saveUserData(userData)
    openOperationTimeoutCountdown()
    router.push('/main')
  }

  /**
   * @description: 登出
   * @return {*}
   */
  const onLogout = () => {
    changeIsLoggedIn(false)
    // saveUserData(null)
    closeOperationTimeoutCountdown()
    router.push('/')
  }

  const onPasswordLogin = async (formData: FormData) => {
    if (formData.username === '' || formData.password === '') {
      createAlert('用户名或密码不可为空')
      return
    }
    const result = await window.JSBridge.login.onPasswordLogin({ ...formData })
    if (result.success) {
      onLogin(result.data)
    } else {
      createAlert(result.msg || '')
      return
    }
  }

  const onFingerLogin = async (userId: number) => {
    const user = await getUserData(userId)
    onLogin(user)
  }

  const onCardLogin = async (cardNumber: string) => {
    if (cardNumber === '') {
      createAlert('刷卡登录失败')
      return
    }

    const result = await window.JSBridge.login.onCardLogin(cardNumber)
    if (result.success) {
      onLogin(result.data)
    } else {
      createAlert(result.msg || '')
      return
    }
  }

  return {
    onLogin,
    onLogout,
    onPasswordLogin,
    onFingerLogin,
    onCardLogin
  }
}
