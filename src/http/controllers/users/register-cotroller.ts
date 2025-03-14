import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExists } from '@/services/errors/user-already-exists'
import { MakeRegisterService } from '@/services/factories/make-register-service'

export async function RegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resgisterBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = resgisterBodySchema.parse(request.body)

  try {
    const registerService = MakeRegisterService()
    await registerService.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      reply.status(409).send({ message: error.message })
    }

    throw error
  }

  reply.status(201).send()
}
