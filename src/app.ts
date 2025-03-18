import { fastify } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { usersRoutes } from './http/controllers/users/routes'
import { gymRoutes } from './http/controllers/gmys/routes'
import { checkInsRoutes } from './http/controllers/check_ins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: '10m' },
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'internal server error.' })
})
