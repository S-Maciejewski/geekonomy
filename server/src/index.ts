import fastify, {FastifyRequest} from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifySession from '@fastify/session'
import {Session} from './Session';

const server = fastify()
server.register(fastifyCookie)
server.register(fastifySession, {
    cookieName: 'sessionId',
    secret: 'a secret with minimum length of 32 characters',
    cookie: {
        secure: false,
    },
})

const session = new Session()

server.addHook('preHandler', (request, reply, next) => {
    if (!session.getById(request.session.sessionId)) session.createSession(request.session.sessionId)
    next()
})

server.get('/sessionTest', async (request, reply) => {
    session.getById(request.session.sessionId).state.score += 1
    return `${request.session.sessionId} - score: ${JSON.stringify(session.getById(request.session.sessionId))}`
})

server.get('/quiz', async (request, reply) => {
    return ''
})

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})