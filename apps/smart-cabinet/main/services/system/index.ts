import { getProductionBgImagePath } from '@smart-cabinet/common/system'
import type {
  Prisma,
  RfidCardUser,
} from '@smart-cabinet/database'
import {
  selectSysDeptList,
  selectSysDeptListWithPage,
  selectSysRoleList,
  selectSysUser,
  selectSysUserList,
  selectSysUserListWithPage,
  selectSysUserRoleList,
  updateRfidCardUser,
} from '@smart-cabinet/database'
import { ipcMain } from 'electron'
import { onCardLogin, onPasswordLogin, updatePassword, verifyCard, verifyPassword } from './user'

export function registerSysModule() {
  ipcMain.handle('sys:select-sys-dept-list', async () => {
    return await selectSysDeptList()
  })

  ipcMain.handle('sys:select-sys-dept-list-with-page', async (_event, pagination: PaginationType, condition?: Prisma.SysDeptWhereInput) => {
    return await selectSysDeptListWithPage(pagination, condition)
  })

  ipcMain.handle('sys:select-sys-role-list', async () => {
    return await selectSysRoleList()
  })

  ipcMain.handle('sys:select-sys-user-role-list', async (_event, userId: number) => {
    return await selectSysUserRoleList({ userId })
  })

  ipcMain.handle('sys:on-password-login', async (_event, username: string, password: string) => {
    return await onPasswordLogin({ username, password })
  })

  ipcMain.handle('sys:on-card-login', async (_event, cardNumber: string) => {
    return await onCardLogin(cardNumber)
  })

  ipcMain.handle('sys:update-password', async (_event, userId: number, password: string) => {
    return await updatePassword(userId, password)
  })

  ipcMain.handle('sys:verify-password', async (_event, params) => {
    return await verifyPassword(params)
  })

  ipcMain.handle('sys:verify-card', async (_event, userId: bigint, cardNumber: string) => {
    return await verifyCard(userId, cardNumber)
  })

  ipcMain.handle('sys:update-rfid-card-user', async (_event, condition: Prisma.RfidCardUserWhereInput, data: Partial<RfidCardUser>) => {
    return await updateRfidCardUser(condition, data)
  })

  ipcMain.handle('sys:select-sys-user', async (_event, userId: number) => {
    return await selectSysUser({ userId })
  })

  ipcMain.handle('sys:select-sys-user-list', async () => {
    return await selectSysUserList()
  })

  ipcMain.handle('sys:select-sys-user-list-with-page', async (_event, pagination: PaginationType, condition?: Prisma.SysUserWhereInput) => {
    return await selectSysUserListWithPage(pagination, condition)
  })

  ipcMain.handle('sys:get-production-bg-image-path', async () => {
    return await getProductionBgImagePath()
  })
}
