import fastify, { FastifyRequest } from 'fastify'
import fastifyCors from 'fastify-cors'
import { ServerSession } from './ServerSession';
import { Engine } from "./Engine";
import { UserSession } from "./model";
import { QuizStatus } from "./GameState";
import { Logger } from './Logger';

require('dotenv').config()
const server = fastify()

server.register(fastifyCors, {
    origin: '*'
})

const serverSession = new ServerSession()
const engine = new Engine(4, 4)

const getSession = (request: FastifyRequest): UserSession => {
    let { sessionId } = request.query as { sessionId: string }
    if (!sessionId || serverSession.getById(sessionId) === undefined) {
        Logger.info(`No session for id '${sessionId}', creating new session`)
        sessionId = serverSession.createNewSessionAndGetId()
    }
    return serverSession.getById(sessionId)
}

server.get('/quiz', async (request, reply) => {
    const userSession = getSession(request)

    try {
        if (userSession.state.quizStatus === QuizStatus.NO_QUIZ || userSession.state.quizStatus === QuizStatus.QUIZ_ANSWERED)
            await engine.generateQuizData(userSession)
        Logger.info(`request sessionId: ${userSession.sessionId}, score: ${userSession.state.score}, correct country: ${userSession.state.quizData?.correctCountry}`)
        reply.code(200).send(userSession.state.getStateForClient(userSession.sessionId))
    } catch (e) {
        Logger.error(`Could not fetch quiz data for ${userSession.sessionId}`, e)
        reply.code(500).send('Could not fetch quiz data')
    }
})

server.post('/answer', async (request, reply) => {
    const userSession = getSession(request)
    const { answer } = request.body as { answer: string }

    if (userSession.state.quizStatus !== QuizStatus.FRESH_QUIZ) {
        reply.code(204).send()
        return
    }
    try {
        const response = await engine.handleAnswer(userSession, answer)
        serverSession.handleHighscore(userSession, response.score)
        reply.code(200).send(response)
    } catch (e) {
        Logger.error(`Could not process the answer to the quiz question for ${userSession.sessionId}`, e)
        reply.code(500).send('Could not process the answer to the quiz question')
    }
})

server.get('/highscore', async (request, reply) => {
    try {
        const response = serverSession.getHighscoreList()
        reply.code(200).send(response)
    } catch (e) {
        Logger.error(`Could not get highscore list`, e)
        reply.code(500).send('Could not get highscore')
    }
})

server.listen(process.env.PORT || 8080, process.env.SERVER_ADDRESS || '127.0.0.1', (err, address) => {
    if (err) {
        Logger.error(`Could not start server`, err)
        process.exit(1)
    }
    Logger.info(`Server listening at ${process.env.SERVER_ADDRESS || address}, port ${process.env.PORT || 8080}`)
})
