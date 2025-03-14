import { UserRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFound } from './errors/resource-not-found'

interface GetUserProfileServiceRequest {
  userID: string
}

interface GetUserProfileServiceResponse {
  user: User
}

export class GetUserProfileService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute({
    userID,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.userRepository.findById(userID)

    if (!user) {
      throw new ResourceNotFound()
    }

    return { user }
  }
}
