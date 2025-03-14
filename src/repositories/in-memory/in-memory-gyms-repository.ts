import { Gym, Prisma } from '@prisma/client'
import { GymRepository, SearchNearbyParams } from '../gym-repository'
import { randomUUID } from 'node:crypto'
import { GetDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymRepository implements GymRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      longitude: new Prisma.Decimal(data.longitude.toString()),
      latitude: new Prisma.Decimal(data.latitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)
    return gym
  }

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async searchNearby({ latitude, longitude }: SearchNearbyParams) {
    const gyms = this.gyms.filter((item) => {
      const distance = GetDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      const MAX_DISTANCE_IN_KILOMETERS = 10

      return distance <= MAX_DISTANCE_IN_KILOMETERS
    })

    return gyms
  }

  async findById(id: string) {
    const gym = this.gyms.find((Gym) => Gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
