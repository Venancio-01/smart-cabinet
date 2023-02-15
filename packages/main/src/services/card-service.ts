import prisma from '@/prisma'

const cardService = {
  name: 'card',
  fns: {
    async updateCardNumber(userId, cardNumber) {
      const result = await prisma.rfid_card_user.updateMany({
        where: {
          user_id: userId
        },
        data: {
          carddata: cardNumber
        }
      })
      return result
    }
  }
}

export default cardService
