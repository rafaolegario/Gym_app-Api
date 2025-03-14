import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository'
import { GymService } from '../create-gym-service'

export function MakeGymService() {
  const gymRepository = new PrismaGymsRepository()
  const gymService = new GymService(gymRepository)
  return gymService
}
