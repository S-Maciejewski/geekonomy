import {Engine} from '../src/Engine'
import {GameState} from '../src/GameState'
import {UserSession} from '../src/model'

describe('game Engine', () => {

    const engine = new Engine(4, 4)
    let userSession: UserSession
    beforeEach(() => {
        userSession = {
            sessionId: '1',
            activeAt: Date.now(),
            state: new GameState()
        }
    })

    test('should generate valid quiz data', async () => {
        await engine.generateQuizData(userSession)
        expect(userSession.state.quizData).not.toBeUndefined()
        expect(userSession.state.quizData?.indicators).toHaveLength(engine.INDICATORS_COUNT)
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

    async function getAnswerResponse(correct: boolean) {
        await engine.generateQuizData(userSession)
        expect(userSession.state.quizData).not.toBeUndefined()
        const correctCountry = correct ?
            userSession.state.quizData!.correctCountry :
            userSession.state.quizData!.countries.map((country => country)).filter(countryName => countryName !== userSession.state.quizData!.correctCountry)[0]
        return engine.handleAnswer(userSession, correctCountry)
    }
})
