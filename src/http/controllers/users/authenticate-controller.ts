import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { InvalidCredentials } from '@/services/errors/invalid-credentials'
import { MakeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function AuthenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authBodySchema.parse(request.body)

  try {
    const authenticateService = MakeAuthenticateService()
    const { user } = await authenticateService.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    reply.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
