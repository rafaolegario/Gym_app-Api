import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository'
import { SearchGymService } from '../search-gyms-service'

export function MakeSearchGymService() {
  const gymRepository = new PrismaGymsRepository()
  const searchGymService = new SearchGymService(gymRepository)
  return searchGymService
}
