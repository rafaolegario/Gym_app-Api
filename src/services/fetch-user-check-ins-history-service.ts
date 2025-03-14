import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryServiceRequest {
  userID: string
  page: number
}

interface FetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    userID,
    page,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userID,
      page,
    )
    return { checkIns }
  }
}
