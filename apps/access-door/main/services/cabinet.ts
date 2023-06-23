import { selectRfidCabinetDoorList } from 'database'


const cabinetService = {
  name: 'cabinet' as const,
  fns: {
    selectRfidCabinetDoorList,
  },
}

export default cabinetService
