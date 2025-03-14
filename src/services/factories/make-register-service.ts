import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '../register-service'

export function MakeRegisterService() {
  const UsersRepository = new PrismaUsersRepository()
  const registerService = new RegisterService(UsersRepository)
  return registerService
}
