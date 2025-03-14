import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { ClearTestDatabase } from '@/utils/tests/clear-test-database'

describe('Register controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await ClearTestDatabase()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to Register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe2@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
