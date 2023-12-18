import type { SysUserProps } from '@smart-cabinet/database'
import { v4 as uuidv4 } from 'uuid'
import createAlert from '@/components/BaseAlert'
import { closeOperationTimeoutCountdown, openOperationTimeoutCountdown } from '@/features/time'
import { useGlobalState } from '@/store'
import router from '@/router'

export interface PasswordLoginType {
  username: string
  password: string
}

const { setIsLoggedIn, setUserData, setGuid } = useGlobalState()

/**
 * @description: 登录
 * @param {UserProps} userData
 * @return {*}
 */
function handleLogin(userData: SysUserProps) {
  setIsLoggedIn(true)
  setGuid(uuidv4())
  setUserData(userData)
  openOperationTimeoutCountdown()

  router.push('/main')
}

export function handleLogout() {
  setIsLoggedIn(false)
  closeOperationTimeoutCountdown()

  router.push('/')
}

export async function handlePasswordLogin(formData: PasswordLoginType) {
  if (formData.username === '' || formData.password === '') {
    createAlert('用户名或密码不可为空')
    return
  }

  const { success, data, msg } = await window.electronApi.ipcRenderer.invoke('sys:on-password-login', formData.username, formData.password)
  if (success && data) handleLogin(data)
  else createAlert(msg || '')
}

export async function handleFingerLogin(userId: bigint) {
  const user = await window.electronApi.ipcRenderer.invoke('sys:select-sys-user', { userId })

  handleLogin(user)
}

export async function handleCardLogin(cardNumber: string) {
  if (cardNumber === '') {
    createAlert('刷卡登录失败')
    return
  }

  const { success, data, msg } = await window.electronApi.ipcRenderer.invoke('sys:on-card-login', cardNumber)
  if (success && data) handleLogin(data)
  else createAlert(msg || '')
}
