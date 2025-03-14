import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history-service'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function MakeFetchUserCheckInsHistoryService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const checkInsHistoryService = new FetchUserCheckInsHistoryService(
    checkInsRepository,
  )
  return checkInsHistoryService
}
