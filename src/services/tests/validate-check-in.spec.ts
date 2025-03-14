import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkIns-repository'
import { ValidateCheckInService } from '../validate-check-in-service'
import { ResourceNotFound } from '../errors/resource-not-found'
import { LateCheckInValidate } from '../errors/late-checkin-validate'

let CheckInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('CheckIn validate Service', () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(CheckInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check In', async () => {
    vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0))
    const check_in = await CheckInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    const { checkIn } = await sut.execute({ checkIn_id: check_in.id })

    expect(checkIn.is_validated).toEqual(expect.any(Date))
    expect(CheckInRepository.checkIns[0].is_validated).toEqual(expect.any(Date))
  })

  it('Should not be able to validate a check-in with a non-existent check-in ID', async () => {
    expect(async () => {
      await sut.execute({ checkIn_id: '12345' })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should be able to validate check In', async () => {
    vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0))
    const check_in = await CheckInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    const { checkIn } = await sut.execute({ checkIn_id: check_in.id })

    expect(checkIn.is_validated).toEqual(expect.any(Date))
    expect(CheckInRepository.checkIns[0].is_validated).toEqual(expect.any(Date))
  })

  it('Should not be able to validate a check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0))

    const check_in = await CheckInRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    vi.advanceTimersByTime(1000 * 60 * 21) // 21 minutes

    expect(async () => {
      await sut.execute({ checkIn_id: check_in.id })
    }).rejects.toBeInstanceOf(LateCheckInValidate)
  })
})
