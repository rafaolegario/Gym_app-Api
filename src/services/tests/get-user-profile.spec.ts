import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { GetUserProfileService } from '../get-user-profile-service'
import { hash } from 'bcryptjs'
import { ResourceNotFound } from '../errors/resource-not-found'

let UsersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get user profile Service', () => {
  beforeEach(async () => {
    UsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(UsersRepository)
  })

  it('should be able to get user profile', async () => {
    const userData = {
      name: 'Jonh Doe',
      email: 'jonhdoe@application.com',
      password_hash: await hash('123456', 6),
    }

    const CreatedUser = await UsersRepository.create(userData)

    const { user } = await sut.execute({ userID: CreatedUser.id })

    expect(user.name).equal('Jonh Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(() =>
      sut.execute({ userID: 'non-exisist-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
