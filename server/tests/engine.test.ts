import {Engine} from '../src/Engine'
import {UserSession} from '../src/model'
import {ServerSession} from "../src/ServerSession";

describe('game Engine', () => {

    const engine = new Engine(4, 4)
    let serverSession: ServerSession
    let userSession: UserSession
    beforeEach(() => {
        serverSession = new ServerSession(true, true)
        const userSessionId = serverSession.createNewSessionAndGetId()
        userSession = serverSession.getById(userSessionId)
    })

    test('should generate valid quiz data', async () => {
        await engine.generateQuizData(userSession)
        expect(userSession.state.quizData).not.toBeUndefined()
        expect(userSession.state.quizData?.indicators).toHaveLength(engine.INDICATORS_COUNT * engine.COUNTRIES_COUNT)
        expect(userSession.state.quizData?.countries).toHaveLength(engine.COUNTRIES_COUNT)
        expect(userSession.state.quizData?.correctCountry).toBeTruthy()
    })

    test('should handle a correct answer and return proper response', async () => {
        const response = await getAnswerResponse(true)
        expect(response.score).toEqual(1)
        expect(response.correct).toBeTruthy()
    })

    test('should handle an incorrect answer, clear the score and return proper response', async () => {
        let response = await getAnswerResponse(true)
        expect(response.score).toEqual(1)
        expect(response.correct).toBeTruthy()

        response = await getAnswerResponse(false)
        expect(response.score).toEqual(0)
        expect(response.correct).toBeFalsy()
    })

    test('should handle multiple correct responses', async () => {
        // TODO
        expect(true).toBeTruthy()
    })

    test('handle new highscore when there are none', async () => {
        serverSession.highscoreList = []
        serverSession.MAX_HIGHSCORES = 2
        let response = await getAnswerResponse(true)
        expect(response.score).toEqual(1)
        expect(response.achievedHighscore).toBeFalsy()
        response = await getAnswerResponse(false)
        expect(response.score).toEqual(0)
        expect(response.achievedHighscore).toBeTruthy()

        expect(serverSession.highscoreList).toHaveLength(1)
        expect(serverSession.highscoreList[0].score).toEqual(1)
        expect(serverSession.highscoreList[0].sessionId).toEqual(userSession.sessionId)
    })

    test('handle highscore when highscore list is full', async () => {
        const currentTimestamp = new Date().valueOf()
        serverSession.highscoreList = [{
            sessionId: 'test-1',
            achievedAt: currentTimestamp,
            score: 1,
            playerTag: 'TST',
        }, {
            sessionId: 'test-2',
            achievedAt: currentTimestamp - 1,
            score: 1,
            playerTag: 'TST',
        }]
        serverSession.MAX_HIGHSCORES = 2

        await getAnswerResponse(true)
        await getAnswerResponse(true)
        let response = await getAnswerResponse(false)

        expect(response.achievedHighscore).toBeTruthy()
        expect(serverSession.highscoreList).toEqual([
            {
                sessionId: userSession.sessionId,
                achievedAt: serverSession.highscoreList[0].achievedAt,
                score: 2,
                playerTag: serverSession.DEFAULT_PLAYER_TAG
            }, {
                sessionId: 'test-1',
                achievedAt: currentTimestamp,
                score: 1,
                playerTag: 'TST',
            }
        ])
    })

    test('maintain proper order of highscore list after a new entry is added', async () => {
        const currentTimestamp = new Date().valueOf()
        serverSession.highscoreList = [{
            sessionId: 'test-1',
            achievedAt: currentTimestamp,
            score: 1,
            playerTag: 'TST',
        }, {
            sessionId: 'test-2',
            achievedAt: currentTimestamp - 1,
            score: 1,
            playerTag: 'TST',
        }, {
            sessionId: 'test-3',
            achievedAt: currentTimestamp,
            score: 2,
            playerTag: 'TST'
        }]
        serverSession.MAX_HIGHSCORES = 4

        await getAnswerResponse(true)
        await getAnswerResponse(true)
        await getAnswerResponse(true)
        let response = await getAnswerResponse(false)

        expect(response.achievedHighscore).toBeTruthy()
        expect(serverSession.highscoreList.map(entry => entry.sessionId)).toEqual([
            userSession.sessionId, 'test-3', 'test-1', 'test-2'
        ])
    })


    async function getAnswerResponse(correct: boolean) {
        await engine.generateQuizData(userSession)
        expect(userSession.state.quizData).not.toBeUndefined()
        const correctCountry = correct ?
            userSession.state.quizData!.correctCountry :
            userSession.state.quizData!.countries.map((country => country)).filter(countryName => countryName !== userSession.state.quizData!.correctCountry)[0]
        return engine.handleAnswer(serverSession, userSession, correctCountry)
    }
})
