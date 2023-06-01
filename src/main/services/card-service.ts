import prisma from '@/database'

async function updateCardNumber(userId: number, cardNumber: string) {
  const result = await prisma.rfid_card_user.updateMany({
    where: {
      user_id: userId,
    },
    data: {
      card_data: cardNumber,
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
