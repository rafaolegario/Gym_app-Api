import '@Fastify/jwt'

export declare module '@Fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMIN' | 'MEMBER'
    }
  }
}
