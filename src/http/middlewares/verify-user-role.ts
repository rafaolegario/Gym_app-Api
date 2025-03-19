import { FastifyReply, FastifyRequest } from 'fastify'

export function VerifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(403).send({ message: 'Unauthorized' })
    }
  }
}
