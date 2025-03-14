import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms-service'
let gymRepository: InMemoryGymRepository
let sut: FetchNearbyGymsService

describe('Fetch nearby gyms service', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsService(gymRepository)
  })

  it('should be able to search for gyms', async () => {
    // 1.52 km
    await gymRepository.create({
      id: 'gym-1',
      title: 'Near Gym',
      description: '',
      phone: '(00) 12345-8789',
      latitude: new Decimal(-22.0141078),
      longitude: new Decimal(-47.8524877),
    })

    // 11 km
    await gymRepository.create({
      id: 'gym-2',
      title: 'Far Gym',
      description: '',
      phone: '(00) 12345-8789',
      latitude: new Decimal(-21.903246),
      longitude: new Decimal(-47.843433),
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.0032456,
      userLongitude: -47.8434326,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
