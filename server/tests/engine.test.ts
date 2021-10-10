import { Engine } from '../src/Engine'
import { GameState } from '../src/GameState'
import { UserSession } from '../src/model'

describe('game engine tests', () => {

	const engine = new Engine()
	let userSession: UserSession
	beforeEach(() => {
		userSession = {
            sessionId: '1',
            state: new GameState()
        }
	})

    test('generate quiz data', async () => {
    	userSession = await engine.generateQuizData(userSession)
        // TODO: engine test with mocked UserSession
        expect(userSession.state.quizData).toBeTruthy()
        // expect(true).toBeTruthy()
    })
})
