import {Engine} from '../src/Engine'
import {GameState} from '../src/GameState'
import {UserSession} from '../src/model'

describe('game Engine', () => {

    const engine = new Engine(4, 4)
    let userSession: UserSession
    beforeEach(() => {
        userSession = {
            sessionId: '1',
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
        await engine.generateQuizData(userSession)
        // TODO: answer test
    })
})
