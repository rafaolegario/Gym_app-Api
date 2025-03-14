import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFound } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { LateCheckInValidate } from './errors/late-checkin-validate'

interface ValidateCheckInServiceRequest {
  checkIn_id: string
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    checkIn_id,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkIn_id)

    if (!checkIn) {
      throw new ResourceNotFound()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    const MaxMinValidation = 20

    if (distanceInMinutesFromCheckInCreation > MaxMinValidation) {
      throw new LateCheckInValidate()
    }
    checkIn.is_validated = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
