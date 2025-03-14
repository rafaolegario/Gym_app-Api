import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkIns-repository'
import { GetUserMetricsService } from '../get-user-metrics-service'

let CheckInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe('Fetch user checkIn history Service', () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(CheckInRepository)
  })

  it('should be able to get check In count from metrics', async () => {
    await CheckInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    await CheckInRepository.create({
      gym_id: 'gym-2',
      user_id: 'user-1',
    })

    const { checkInsCount } = await sut.execute({
      userID: 'user-1',
    })

    expect(checkInsCount).toEqual(2)
  })
})
