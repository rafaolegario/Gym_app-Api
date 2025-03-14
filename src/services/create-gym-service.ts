import { Gym } from '@prisma/client'
import { GymRepository } from '@/repositories/gym-repository'

interface GymServiceRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface GymServiceResponse {
  gym: Gym
}

export class GymService {
  private gymRepository: GymRepository

  constructor(gymRepository: GymRepository) {
    this.gymRepository = gymRepository
  }

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: GymServiceRequest): Promise<GymServiceResponse> {
    const gymData = {
      title,
      description,
      phone,
      latitude,
      longitude,
    }

    const gym = await this.gymRepository.create(gymData)

    return {
      gym,
    }
  }
}
