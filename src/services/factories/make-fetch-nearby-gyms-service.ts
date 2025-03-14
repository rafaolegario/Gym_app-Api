import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms-service'

export function MakeFetchNearbyGymsService() {
  const gymRepository = new PrismaGymsRepository()
  const gymService = new FetchNearbyGymsService(gymRepository)
  return gymService
}
