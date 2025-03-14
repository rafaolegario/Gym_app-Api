import { UserRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentials()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentials()
    }

    return { user }
  }
}
