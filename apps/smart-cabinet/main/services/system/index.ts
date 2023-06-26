import { getProductionBgImagePath } from 'common/system'
import {
  selectSysDeptList,
  selectSysDeptListWithPage,
  selectSysRoleList,
  selectSysUser,
  selectSysUserList,
  selectSysUserListWithPage,
  selectSysUserRoleList,
  updateRfidCardUser,
} from 'database'
import { onCardLogin, onPasswordLogin, updatePassword, verifyCard, verifyPassword } from './user'

const sysService = {
  name: 'sys' as const,
  fns: {
    selectSysUser,
    selectSysUserList,
    selectSysUserListWithPage,
    selectSysDeptList,
    selectSysDeptListWithPage,
    onPasswordLogin,
    onCardLogin,
    updatePassword,
    verifyPassword,
    verifyCard,
    updateRfidCardUser,
    selectSysRoleList,
    selectSysUserRoleList,
    getProductionBgImagePath,
  },
}

export default sysService
