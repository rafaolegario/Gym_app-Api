import '@Fastify/jwt'

export declare module '@Fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
    } // user type is return type of 'request.user' object
  }
}
