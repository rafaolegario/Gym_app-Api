import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { ClearTestDatabase } from '@/utils/tests/clear-test-database'
import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'

describe('Profile controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await ClearTestDatabase()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to Authenticate', async () => {
    const { token } = await CreateAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )
  })
})
