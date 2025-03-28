import { prisma } from '@/http/controllers/users/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'

import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }

  async findManyByUserId(userId: string, page: number) {
    const checkins = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkins
  }

  async findById(id: string) {
    const checkin = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkin
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkin = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    })

    return checkin
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = await prisma.checkIn.create({
      data,
    })

    return checkin
  }
}
