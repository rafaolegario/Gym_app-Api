import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticate-service'

export function MakeAuthenticateService() {
  const UsersRepository = new PrismaUsersRepository()
  const authenticateService = new AuthenticateService(UsersRepository)
  return authenticateService
}
