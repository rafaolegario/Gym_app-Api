import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterService } from '../register-service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExists } from '../errors/user-already-exists'

let UsersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(async () => {
    UsersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(UsersRepository)
  })

  it('should hash user password upon registration', async () => {
    const userData = {
      name: 'Jonh Doe',
      email: 'jonhdoe@application.com',
      password: 'password',
    }

    const { user } = await sut.execute(userData)

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userData = {
      name: 'Jonh Doe',
      email: 'jonhdoe@application.com',
      password: 'password',
    }

    await sut.execute(userData)

    await expect(() => sut.execute(userData)).rejects.toBeInstanceOf(
      UserAlreadyExists,
    )
  })

  it('should be able to register user', async () => {
    const userData = {
      name: 'Jonh Doe',
      email: 'jonhdoe@application.com',
      password: 'password',
    }

    const { user } = await sut.execute(userData)

    expect(user.id).toEqual(expect.any(String))
  })
})
