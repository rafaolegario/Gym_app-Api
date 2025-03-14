import { prisma } from '@/http/controllers/users/lib/prisma'

export async function ClearTestDatabase() {
  await prisma.$executeRaw`DELETE FROM "check_ins"`
  await prisma.$executeRaw`DELETE FROM "gyms"`
  await prisma.$executeRaw`DELETE FROM "users"`
}
