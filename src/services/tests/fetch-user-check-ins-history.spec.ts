import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkIns-repository'
import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history-service'

let CheckInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryService

describe('Fetch user checkIn history Service', () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(CheckInRepository)
  })

  it('should be able to fetch check In history', async () => {
    await CheckInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    await CheckInRepository.create({
      gym_id: 'gym-2',
      user_id: 'user-1',
    })

    const { checkIns } = await sut.execute({
      userID: 'user-1',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await CheckInRepository.create({
        gym_id: 'gym-' + i,
        user_id: 'user-1',
      })
    }

    const { checkIns } = await sut.execute({
      userID: 'user-1',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
