import { prisma } from '@/http/controllers/users/lib/prisma'
import { Prisma } from '@prisma/client'
import { UserRepository } from '../users-repository'

export class PrismaUsersRepository implements UserRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const users = await prisma.user.create({
      data,
    })

    return users
  }
}
