import fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'
import fastifyCors from 'fastify-cors'
import fastifySession from '@fastify/session'
import {Session} from './Session';
import {Engine} from "./Engine";

require('dotenv').config()
const server = fastify()
server.register(fastifyCookie)
server.register(fastifyCors, {
    origin: 'http://localhost:3000',
    credentials: true
})
server.register(fastifySession, {
    cookieName: 'sessionId',
    secret: process.env.SESSION_SECRET || 'a secret with minimum length of 32 characters',
    cookie: {
        secure: false,
    },
})

const session = new Session()
const engine = new Engine(4, 4)

server.addHook('preHandler', (request, reply, next) => {
    if (!session.getById(request.session.sessionId)) session.createSession(request.session.sessionId)
    next()
})

server.get('/quiz', async (request, reply) => {
    const userSession = session.getById(request.session.sessionId)
    try {
        await engine.generateQuizData(userSession)
        reply.code(200).send(userSession.state.getStateForClient())
    } catch (e) {
        reply.code(500).send('Could not fetch quiz data')
    }
})

server.post('/answer', async (request, reply) => {
    const userSession = session.getById(request.session.sessionId)
    const {answer} = request.body as { answer: string }
    try {
        const response = await engine.handleAnswer(userSession, answer)
        reply.code(200).send(response)
    } catch (e) {
        reply.code(500).send('Could not process the answer to the quiz question')
    }
})

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})