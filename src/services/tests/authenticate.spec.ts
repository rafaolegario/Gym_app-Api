import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { AuthenticateService } from '../authenticate-service'
import { InvalidCredentials } from '../errors/invalid-credentials'

let UsersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(async () => {
    UsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(UsersRepository)
  })

  it('should be able to authenticate', async () => {
    const userData = {
      name: 'Jonh Doe',
      email: 'jonhdoe@application.com',
      password_hash: await hash('123456', 6),
    }

    await UsersRepository.create(userData)

    const { user } = await sut.execute({
      email: 'jonhdoe@application.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    expect(async () => {
      await sut.execute({
        email: 'jonhdoe@application.com',
        password: '123455',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userData = {
      name: 'Jonh Doe',
      email: 'jonhdoe@application.com',
      password_hash: await hash('123456', 6),
    }

    await UsersRepository.create(userData)

    expect(async () => {
      await sut.execute({
        email: 'jonhdoe@application.com',
        password: '123455',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
