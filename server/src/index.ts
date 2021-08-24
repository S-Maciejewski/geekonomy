import fastify, {FastifyRequest} from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifySession from '@fastify/session'
import {randomInt, randomUUID} from 'crypto'

const server = fastify()
server.register(fastifyCookie)
server.register(fastifySession, {
    cookieName: 'sessionId',
    secret: 'a secret with minimum length of 32 characters',
    cookie: {
        secure: false,
    },
})


server.addHook('preHandler', (request, reply, next) => {
    request.session.sessionId = request.session.sessionId ?? randomUUID()
    // @ts-ignore
    request.session.user = randomInt(100)
    next()
})

server.get('/quizData', async (request, reply) => {
    // @ts-ignore
    return `${request.session.sessionId} - ${request.session.user}`
})

server.get('/ping', async (request, reply) => {
    return 'pong\n'
})

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})