import { selectSysDeptList } from 'database'
import { getProductionBgImagePath } from 'common/system'

const sysService = {
  name: 'sys' as const,
  fns: {
    selectSysDeptList,
    getProductionBgImagePath,
  },
}

export default sysService
