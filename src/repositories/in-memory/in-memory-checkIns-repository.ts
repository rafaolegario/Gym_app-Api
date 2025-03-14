import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.checkIns.find((check) => {
      const checkInDate = dayjs(check.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return check.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) {
      return null
    }

    return checkOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkIns
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findById(checkIn_id: string) {
    const checkIn = this.checkIns.find((item) => item.id === checkIn_id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findByUserId(userId: string) {
    return this.checkIns.filter((item) => item.user_id === userId).length
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkIns.splice(checkInIndex, 1, checkIn)
    }

    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      is_validated: data.is_validated ? new Date(data.is_validated) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)
    return checkIn
  }
}
