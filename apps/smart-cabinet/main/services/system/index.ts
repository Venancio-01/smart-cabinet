import { getProductionBgImagePath } from 'common/system'
import { selectSysDeptList } from 'database'
import {
  getUsers,
  getUsersByCondition,
  onCardLogin,
  onPasswordLogin,
  updateCardNumber,
  updatePassword,
  verifyCard,
  verifyPassword,
} from './user'
import { getRoleList, getUserRoleList } from './role'

const sysService = {
  name: 'sys' as const,
  fns: {
    selectSysDeptList,
    getUsers,
    getUsersByCondition,
    onPasswordLogin,
    onCardLogin,
    updatePassword,
    verifyPassword,
    verifyCard,
    updateCardNumber,
    getRoleList,
    getUserRoleList,
    getProductionBgImagePath,
  },
}

export default sysService
