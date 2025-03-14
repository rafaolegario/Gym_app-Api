import { UserRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExists } from './errors/user-already-exists'
import { User } from '@prisma/client'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const userData = {
      name,
      email,
      password_hash,
    }

    const user = await this.userRepository.create(userData)

    return {
      user,
    }
  }
}
