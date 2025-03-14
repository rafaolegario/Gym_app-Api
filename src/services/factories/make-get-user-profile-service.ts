import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileService } from '../get-user-profile-service'

export function MakeGetUserProfileService() {
  const UsersRepository = new PrismaUsersRepository()
  const getUserProfileService = new GetUserProfileService(UsersRepository)
  return getUserProfileService
}
