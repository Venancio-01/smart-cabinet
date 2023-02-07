import prisma from '@/prisma'

const cardService = {
  name: 'card',
  fns: {
    async updateCardNumber(userId, cardNumber) {
      const result = await prisma.rfid_card_user.updateMany({
        where: {
          USERID: userId
        },
        data: {
          CARDDATA: cardNumber
        }
      })
      return result
    }
  }
}

export default cardService
