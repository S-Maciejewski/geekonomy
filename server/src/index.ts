import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import {Session} from './Session';
import {Engine} from "./Engine";
import {UserSession} from "./model";

require('dotenv').config()
const server = fastify()

server.register(fastifyCors, {
    origin: 'http://localhost:3000',
    credentials: true
})

const session = new Session()
const engine = new Engine(4, 4)

server.addHook('preHandler', (request, reply, next) => {
    const {sessionId} = request.query as { sessionId: string }
    if (!session.getById(sessionId)) session.createSession()
    next()
})

server.get('/quiz', async (request, reply) => {
    const {sessionId} = request.query as { sessionId: string }

    // TODO fix this terrible workaround - it does not guarantee to scale past 1 client
    const userSession = session.getById(sessionId) ?? session.sessions.at(-1) as UserSession
    console.log(`request sessionId: ${sessionId}, userSession sessionId: ${userSession.sessionId}`)

    // TODO handle getting new quiz data after answering / resetting the game
    try {
        if (!userSession.state.quizData) await engine.generateQuizData(userSession)
        reply.code(200).send(userSession.state.getStateForClient(userSession.sessionId))
    } catch (e) {
        console.error(`Could not fetch quiz data for ${sessionId}`, e)
        reply.code(500).send('Could not fetch quiz data')
    }
})

server.post('/answer', async (request, reply) => {
    const {sessionId} = request.query as { sessionId: string }
    const userSession = session.getById(sessionId)
    const {answer} = request.body as { answer: string }
    try {
        const response = await engine.handleAnswer(userSession, answer)
        reply.code(200).send(response)
    } catch (e) {
        console.error(`Could not process the answer to the quiz question for ${sessionId}`, e)
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