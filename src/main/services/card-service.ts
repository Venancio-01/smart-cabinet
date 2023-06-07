import { prisma } from '@/database'

async function updateCardNumber(userId: number, cardNumber: string) {
  const result = await prisma.rfid_card_user.updateMany({
    where: {
      Userid: userId,
    },
    data: {
      CardData: cardNumber,
    },
  })
  return result
}

const cardService = {
  name: 'card' as const,
  fns: {
    updateCardNumber,
  },
}

export default cardService
