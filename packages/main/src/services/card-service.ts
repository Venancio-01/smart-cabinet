import prisma from '@/prisma'

const cardService = {
  name: 'card' as const  ,
  fns: {
    async updateCardNumber(userId: number, cardNumber: string) {
      const result = await prisma.rfid_card_user.updateMany({
        where: {
          user_id: userId
        },
        data: {
          card_data: cardNumber
        }
      })
      return result
    }
  }
}

export default cardService
