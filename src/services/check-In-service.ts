import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymRepository } from '@/repositories/gym-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFound } from './errors/resource-not-found'
import { GetDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins'
import { MaxDistance } from './errors/max-distance'

interface CheckInServiceRequest {
  userID: string
  gymID: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  private checkInsRepository: CheckInsRepository
  private gymsRepository: GymRepository

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymRepository,
  ) {
    this.checkInsRepository = checkInsRepository
    this.gymsRepository = gymsRepository
  }

  async execute({
    userID,
    gymID,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymID)

    if (!gym) {
      throw new ResourceNotFound()
    }

    const distance = GetDistanceBetweenCoordinates(
      { longitude: userLongitude, latitude: userLatitude },
      {
        longitude: gym.longitude.toNumber(),
        latitude: gym.latitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistance()
    }

    const checkOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userID,
      new Date(),
    )

    if (checkOnSameDay) {
      throw new MaxNumberOfCheckIns()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymID,
      user_id: userID,
    })

    return { checkIn }
  }
}
