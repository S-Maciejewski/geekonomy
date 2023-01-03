import {AnswerServerResponse, Highscore, UserSession} from "./model";
import {DwhRepository, PreGeneratedRepository, Repository} from "./Repository";
import {QuizStatus} from "./GameState";
import {ServerSession} from "./ServerSession";

const supported = require('../config/supported.json')

/*
While the state of games is stored in Session, the Engine itself should remain stateless,
only handling the state changes for user session for which Engine methods are called
(and returning additional primitive data, such as whether the answer was correct or not)
 */
export interface EngineContract {
    generateQuizData(session: UserSession): Promise<void>

    handleAnswer(serverSession: ServerSession, session: UserSession, answer: string): AnswerServerResponse

    handleHighscore(serverSession: ServerSession, session: UserSession): boolean
}

export class Engine implements EngineContract {
    COUNTRIES_COUNT: number
    INDICATORS_COUNT: number

    repository: Repository

    constructor(COUNTRIES_COUNT: number, INDICATORS_COUNT: number, useDwh: boolean = false) {
        this.COUNTRIES_COUNT = COUNTRIES_COUNT
        this.INDICATORS_COUNT = INDICATORS_COUNT
        this.repository = useDwh ? new DwhRepository() : new PreGeneratedRepository()
    }

    async generateQuizData(session: UserSession): Promise<void> {
        const quizData = await this.repository.getQuizData(this.COUNTRIES_COUNT, this.INDICATORS_COUNT)
        session.state.updateQuizData(quizData)
        return
    }

    handleAnswer(serverSession: ServerSession, userSession: UserSession, answer: string): AnswerServerResponse {
        // TODO: investigate error Could not process the answer to the quiz question for 8b08b8ff-e27c-4b54-9d4b-3c77091414c7 TypeError: Cannot read property 'quizData' of undefined
        // at Engine.handleAnswer

        if (!userSession.state.quizData)
            throw ('Could not find the quiz to answer')

        const answerServerResponse = ({
            sessionId: userSession.sessionId,
            quizStatus: QuizStatus.QUIZ_ANSWERED,
            country: answer,
            correctCountry: userSession.state.quizData.correctCountry,
            indicators: userSession.state.quizData.indicators,
        })

        if (answer === userSession.state.quizData.correctCountry) {
            userSession.state.incrementScore()
            return ({
                ...answerServerResponse,
                score: userSession.state.score,
                correct: true
            })
        }

        const achievedHighscore = this.handleHighscore(serverSession, userSession)
        userSession.state.clearScore()
        return ({
            ...answerServerResponse,
            score: userSession.state.score,
            correct: false,
            achievedHighscore
        })
    }

    handleHighscore(serverSession: ServerSession, userSession: UserSession): boolean {
        const currentHighscores = serverSession.getHighscoreList()
        if ((currentHighscores.find(entry => entry.score <= userSession.state.score) === undefined && currentHighscores.length >= serverSession.MAX_HIGHSCORES) ||
            currentHighscores.find(entry => entry.sessionId === userSession.sessionId && entry.score > userSession.state.score) !== undefined) {
            return false
        }
        const newHighscore: Highscore = {
            sessionId: userSession.sessionId,
            score: userSession.state.score,
            achievedAt: Date.now(),
            playerTag: serverSession.DEFAULT_PLAYER_TAG,
        }
        serverSession.updateHighscoreList(newHighscore)
        return true
    }

    setHighscoreTag(serverSession: ServerSession, userSession: UserSession, tag: string): void {
        const currentHighscores = serverSession.getHighscoreList()
        const playerHighscore = currentHighscores.find(entry => entry.sessionId === userSession.sessionId)
        if (playerHighscore === undefined)
            throw Error('Could not find the highscore to update')
        playerHighscore.playerTag = tag
        serverSession.updateHighscoreList(playerHighscore)
    }
}
