import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GymService } from '../create-gym-service'

let gymRepository: InMemoryGymRepository
let sut: GymService

describe('Create gym Service', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    sut = new GymService(gymRepository)
  })

  it('should be able to create a gym', async () => {
    const gymData = {
      title: 'Gym fitness',
      description: 'The best gym',
      phone: '',
      longitude: -22.0412209,
      latitude: -47.9119285,
    }
    const { gym } = await sut.execute(gymData)

    expect(gym.id).toEqual(expect.any(String))
  })
})
