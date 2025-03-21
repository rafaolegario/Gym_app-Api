import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsService } from '../get-user-metrics-service'

export function MakeGetUserMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsService = new GetUserMetricsService(checkInsRepository)
  return getUserMetricsService
}
