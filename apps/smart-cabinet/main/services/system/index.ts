import { getProductionBgImagePath } from 'common/system'
import { selectSysDeptList, selectSysRoleList, selectSysUser, selectSysUserList, selectSysUserRoleList, updateRfidCardUser } from 'database'
import { getUsersByCondition, onCardLogin, onPasswordLogin, updatePassword, verifyCard, verifyPassword } from './user'

const sysService = {
  name: 'sys' as const,
  fns: {
    selectSysUser,
    selectSysUserList,
    selectSysDeptList,
    getUsersByCondition,
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
