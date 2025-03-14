import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { ClearTestDatabase } from '@/utils/tests/clear-test-database'
import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'

describe('Create gyms controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await ClearTestDatabase()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await CreateAndAuthenticateUser(app)
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Fitness Gym',
        description: 'The best gym in the world',
        phone: '1234567893',
        latitude: -22.0141078,
        longitude: -47.8524877,
      })

    expect(response.statusCode).toEqual(201)
  })
})
