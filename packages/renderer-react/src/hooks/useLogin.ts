import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'

export default function () {
  const navigate = useNavigate()
  const { changeIsLogin } = useStore(state => state)

  /**
   * @description: 登录
   * @param {UserProps} userData
   * @return {*}
   */
  const handleLogin = (userData?: UserProps) => {
    changeIsLogin(true)
    navigate('/main')
  }

  // /**
  //  * @description: 登出
  //  * @return {*}
  //  */
  // const handleLogout = () => {
  //   setIsLoggedIn(false)
  //   // saveUserData(null)
  //   closeOperationTimeoutCountdown()
  //   router.push('/')
  // }

  const handlePasswordLogin = async (data: LoginFormState) => {
    const result = await window.JSBridge.login.onPasswordLogin({ ...data })

    console.log("🚀 ~ file: useLogin.ts:31 ~ handlePasswordLogin ~ result:", result)

    if (result.success) {
      handleLogin(result.data)
    } else {
      return
    }
  }

  // const handleFingerLogin = async (userId: number) => {
  //   const user = await getUserData(userId)
  //   handleLogin(user)
  // }

  // const handleCardLogin = async (cardNumber: string) => {
  //   if (cardNumber === '') {
  //     createAlert('刷卡登录失败')
  //     return
  //   }

  //   const result = await window.JSBridge.login.onCardLogin(cardNumber)
  //   if (result.success) {
  //     handleLogin(result.data)
  //   } else {
  //     createAlert(result.msg || '')
  //     return
  //   }
  // }

  return {
    handleLogin,
    handlePasswordLogin
  }
}
