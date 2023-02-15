import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'
import useUser from './useUser'
import { password_KEY } from '@/config'

export interface FormData {
  username: string
  password: string
}

export default function () {
  const store = useStore()
  const { changeIsLoggedIn, changeLoginVisible, saveUserData, changeLoginModeIndex } = store
  const { getUserData } = useUser()

  const onLogin = (userData: any) => {
    changeIsLoggedIn(true)
    changeLoginVisible(false)
    changeLoginModeIndex(password_KEY)
    saveUserData(userData)
  }

  const onLogout = () => {
    changeIsLoggedIn(false)
    // saveUserData(null)
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
