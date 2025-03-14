import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeGetUserProfileService } from '@/services/factories/make-get-user-profile-service'

export async function ProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserProfile = MakeGetUserProfileService()

  const { user } = await getUserProfile.execute({
    userID: request.user.sub,
  })

  reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
