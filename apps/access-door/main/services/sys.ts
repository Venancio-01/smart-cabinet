import { selectSysDeptList } from '@smart-cabinet/database'
import { getProductionBgImagePath } from '@smart-cabinet/common/system'

const sysService = {
  name: 'sys' as const,
  fns: {
    selectSysDeptList,
    getProductionBgImagePath,
  },
}

export default sysService
