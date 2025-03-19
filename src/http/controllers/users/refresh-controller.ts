import { FastifyReply, FastifyRequest } from 'fastify'

export async function RefreshController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  reply
    .setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none',
    })
    .status(200)
    .send({ token })
}
