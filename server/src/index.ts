import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import {Session} from './Session';
import {Engine} from "./Engine";
import {UserSession} from "./model";
import {QuizStatus} from "./GameState";

require('dotenv').config()
const server = fastify()

server.register(fastifyCors, {
    origin: '*'
})

const session = new Session(3600)
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

    try {
        if (userSession.state.quizStatus === QuizStatus.NO_QUIZ || userSession.state.quizStatus === QuizStatus.QUIZ_ANSWERED)
            await engine.generateQuizData(userSession)
        console.debug(`request sessionId: ${sessionId}, score: ${userSession.state.score}, correct country:`, userSession.state.quizData?.correctCountry)
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

    if (userSession.state.quizStatus !== QuizStatus.FRESH_QUIZ) {
        reply.code(204).send()
        return
    }
    try {
        const response = await engine.handleAnswer(userSession, answer)
        session.handleHighscore(userSession, response.score)
        reply.code(200).send(response)
    } catch (e) {
        console.error(`Could not process the answer to the quiz question for ${sessionId}`, e)
        reply.code(500).send('Could not process the answer to the quiz question')
    }
})

server.get('/highscore', async (request, reply) => {
    try {
        const response = session.getHighscoreList()
        reply.code(200).send(response)
    } catch (e) {
        console.error(`Could not get highscore list`, e)
        reply.code(500).send('Could not get highscore')
    }
})

server.listen(process.env.PORT || 8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${process.env.SERVER_ADDRESS || address}`)
})