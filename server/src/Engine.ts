import {AnswerServerResponse, Country, Indicator, UserSession} from "./model";
import * as _ from 'lodash';
import {Repository} from "./Repository";
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

    constructor(COUNTRIES_COUNT: number, INDICATORS_COUNT: number) {
        this.COUNTRIES_COUNT = COUNTRIES_COUNT
        this.INDICATORS_COUNT = INDICATORS_COUNT
        this.repository = new Repository()
    }

    async generateQuizData(session: UserSession): Promise<void> {
        const randomCountries: Country[] = _.sampleSize(supported.countries, this.COUNTRIES_COUNT)
        const randomIndicators: Indicator[] = _.sampleSize(supported.indicators, this.INDICATORS_COUNT)
        const correctCountry = _.sample(randomCountries) as Country
        session.state.updateQuizData({
            indicators: await this.repository.fetchSingleCountryQuizData(correctCountry, randomIndicators),
            countries: randomCountries,
            correctCountry
        })
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