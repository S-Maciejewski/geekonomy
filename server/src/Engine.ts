import {AnswerServerResponse, UserSession} from "./model";
import {DwhRepository, PreGeneratedRepository, Repository} from "./Repository";
import {QuizStatus} from "./GameState";

const supported = require('../config/supported.json')

/*
While the state of games is stored in Session, the Engine itself should remain stateless,
only handling the state changes for user session for which Engine methods are called
(and returning additional primitive data, such as whether the answer was correct or not)
 */
export interface EngineContract {
    generateQuizData(session: UserSession): Promise<void>

    handleAnswer(session: UserSession, answer: string): AnswerServerResponse
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

    handleAnswer(session: UserSession, answer: string): AnswerServerResponse {
        if (!session.state.quizData)
            throw ('Could not find the quiz to answer')

        const answerServerResponse = ({
            sessionId: session.sessionId,
            quizStatus: QuizStatus.QUIZ_ANSWERED,
            country: answer,
            correctCountry: session.state.quizData.correctCountry,
            indicators: session.state.quizData.indicators,
            highscore: session.highscore
        })

        if (answer === session.state.quizData.correctCountry) {
            session.state.incrementScore()
            return ({
                ...answerServerResponse,
                score: session.state.score,
                correct: true
            })
        }

        session.state.clearScore()
        return ({
            ...answerServerResponse,
            score: session.state.score,
            correct: false
        })
    }
}