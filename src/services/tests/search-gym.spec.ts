import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymService } from '../search-gyms-service'
import { Decimal } from '@prisma/client/runtime/library'

let gymRepository: InMemoryGymRepository
let sut: SearchGymService

describe('Search many gyms service', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    sut = new SearchGymService(gymRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymRepository.create({
      id: 'gym-1',
      title: 'Fitness Gym',
      description: '',
      phone: '(00) 12345-8789',
      latitude: new Decimal(-22.0412209),
      longitude: new Decimal(-47.9119285),
    })

    await gymRepository.create({
      id: 'gym-2',
      title: 'Dev Gym',
      description: '',
      phone: '(00) 12345-8789',
      latitude: new Decimal(-23.0412209),
      longitude: new Decimal(-48.9119285),
    })

    const { gyms } = await sut.execute({
      query: 'Fitness',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Fitness Gym' })])
  })

  it('should be able to fetch paginated search gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        id: 'gym-' + i,
        title: `Fitness Gym-${i}`,
        description: '',
        phone: '(00) 12345-8789',
        latitude: new Decimal(-23.0412209),
        longitude: new Decimal(-48.9119285),
      })
    }

    const { gyms } = await sut.execute({
      query: 'Fitness',
      page: 2,
    })

    console.log(
      gyms.forEach((i) => {
        return i.title
      }),
    )

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Fitness Gym-21' }),
      expect.objectContaining({ title: 'Fitness Gym-22' }),
    ])
  })
})
