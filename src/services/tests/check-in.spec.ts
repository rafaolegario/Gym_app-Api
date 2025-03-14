import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkIns-repository'
import { CheckInService } from '../check-In-service'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistance } from '../errors/max-distance'
import { MaxNumberOfCheckIns } from '../errors/max-number-of-check-ins'

let CheckInRepository: InMemoryCheckInsRepository
let GymRepository: InMemoryGymRepository
let sut: CheckInService

describe('CheckIn Service', () => {
  beforeEach(async () => {
    CheckInRepository = new InMemoryCheckInsRepository()
    GymRepository = new InMemoryGymRepository()
    sut = new CheckInService(CheckInRepository, GymRepository)

    vi.useFakeTimers()

    GymRepository.gyms.push({
      id: 'gym-1',
      title: 'Gym Fit',
      description: '',
      phone: '(00) 12345-8789',
      latitude: new Decimal(-22.0412209),
      longitude: new Decimal(-47.9119285),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check In', async () => {
    vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymID: 'gym-1',
      userID: 'user-1',
      userLatitude: -22.0412209,
      userLongitude: -47.9119285,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check In twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0))

    await sut.execute({
      gymID: 'gym-1',
      userID: 'user-1',
      userLatitude: -22.0412209,
      userLongitude: -47.9119285,
    })

    expect(async () => {
      await sut.execute({
        gymID: 'gym-1',
        userID: 'user-1',
        userLatitude: -22.0412209,
        userLongitude: -47.9119285,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckIns)
  })

  it('should be able to check In twice but in the different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 10, 8, 0, 0))

    await sut.execute({
      gymID: 'gym-1',
      userID: 'user-1',
      userLatitude: -22.0412209,
      userLongitude: -47.9119285,
    })

    vi.setSystemTime(new Date(2025, 0, 15, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymID: 'gym-1',
      userID: 'user-1',
      userLatitude: -22.0412209,
      userLongitude: -47.9119285,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check In on distant gym', async () => {
    GymRepository.gyms.push({
      id: 'gym-2',
      title: 'Gym Fit',
      description: '',
      phone: '(00) 12345-8789',
      latitude: new Decimal(-21.9943112),
      longitude: new Decimal(-47.8728544),
    })

    expect(async () => {
      await sut.execute({
        gymID: 'gym-2',
        userID: 'user-1',
        userLatitude: -22.0412209,
        userLongitude: -47.9119285,
      })
    }).rejects.toBeInstanceOf(MaxDistance)
  })
})
