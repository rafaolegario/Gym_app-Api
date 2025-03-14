import { GymRepository } from '@/repositories/gym-repository'
import { Gym } from '@prisma/client'

interface FetchNearbyGymsServiceRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsServiceResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  private gymsRepository: GymRepository

  constructor(gymsRepository: GymRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsServiceRequest): Promise<FetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
