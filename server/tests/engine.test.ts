import { GameState } from './src/GameState'
import { UserSession } from './src/model'
import { Engine } from './src/Engine'

describe('game engine tests', () => {

	const engine = new Engine()
	const userSession: UserSession
	beforeEach(() => {
		userSession = {
			sessionId: '1',
			state: new GameState()
	})

    test('generate quiz data', async () => {
    	userSession = await engine.generateQuizData(userSession)
        // TODO: engine test with mocked UserSession
        epxect(userSession.state.quizData).toBeTruthy()
        // expect(true).toBeTruthy()
    })
})
