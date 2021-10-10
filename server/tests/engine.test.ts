import {Engine} from '../src/Engine'
import {GameState} from '../src/GameState'
import {UserSession} from '../src/model'

describe('game Engine', () => {

    const engine = new Engine()
    let userSession: UserSession
    beforeEach(() => {
        userSession = {
            sessionId: '1',
            state: new GameState()
        }
    })

    test('should generate valid quiz data', async () => {
        userSession = await engine.generateQuizData(userSession)
        expect(userSession.state.quizData).not.toBeUndefined()
        expect(userSession.state.quizData?.indicators).toHaveLength(engine.INDICATORS_COUNT)
        expect(userSession.state.quizData?.countries).toHaveLength(engine.COUNTRIES_COUNT)
        expect(userSession.state.quizData?.correctCountry).toBeTruthy()
    })
})
