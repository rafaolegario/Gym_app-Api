import { Gym, Prisma } from '@prisma/client'

export interface SearchNearbyParams {
  latitude: number
  longitude: number
}

export interface GymRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  searchNearby(params: SearchNearbyParams): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
