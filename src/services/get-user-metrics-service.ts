import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsServiceRequest {
  userID: string
}

interface GetUserMetricsServiceResponse {
  checkInsCount: number
}

export class GetUserMetricsService {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    userID,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
    const checkInsCount = await this.checkInsRepository.findByUserId(userID)

    return { checkInsCount }
  }
}
