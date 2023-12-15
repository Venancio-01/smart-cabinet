import { compareActivationCode, generateActivationCode, generateRegistrationCode } from '@smart-cabinet/common/activation'

/**
 * 软件激活
 */
const activationService = {
  name: 'activation' as const,
  fns: {
    generateRegistrationCode,
    generateActivationCode,
    compareActivationCode,
  },
}

export default activationService
