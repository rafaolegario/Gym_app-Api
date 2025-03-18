import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'
import { PrismaClient } from '@prisma/client'

describe('History checkIns controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get checkIn history', async () => {
    const { token, user } = await CreateAndAuthenticateUser(app)

    const prisma = new PrismaClient()
    console.log('user', user)
    const gym = await prisma.gym.create({
      data: {
        title: 'Fitness Gym',
        latitude: -22.0141078,
        longitude: -47.8524877,
      },
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
