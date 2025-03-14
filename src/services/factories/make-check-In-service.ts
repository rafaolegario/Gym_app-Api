import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInService } from '../check-In-service'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository'

export function MakeCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymRepository = new PrismaGymsRepository()
  const checkInService = new CheckInService(checkInsRepository, gymRepository)
  return checkInService
}
