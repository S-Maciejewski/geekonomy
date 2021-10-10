import {AnswerClientResponse, Country, Indicator, UserSession} from "./model";
import * as _ from 'lodash';
import {Repository} from "./Repository";

const supported = require('../config/supported.json')

/*
While the state of games is stored in Session, the Engine itself should remain stateless,
only handling the state changes for user session for which Engine methods are called
(and returning additional primitive data, such as whether the answer was correct or not)
 */
export interface EngineContract {
    generateQuizData(session: UserSession): Promise<void>

    handleAnswer(session: UserSession, answer: string): AnswerClientResponse
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
        const correctCountry = randomCountries[0]
        session.state.updateQuizData({
            indicators: await this.repository.fetchSingleCountryQuizData(correctCountry, randomIndicators),
            countries: randomCountries,
            correctCountry
        })
        return
    }

    handleAnswer(session: UserSession, answer: string): AnswerClientResponse {
        if (!session.state.quizData)
            throw ('Could not find the quiz to answer')

        const answerClientResponse = ({
            score: session.state.score,
            country: answer,
            correctCountry: session.state.quizData.correctCountry.name,
        })

        if (answer === session.state.quizData.correctCountry.name) {
            session.state.incrementScore()
            return ({
                ...answerClientResponse,
                correct: true
            })
        }
        session.state.clearScore()
        return ({
            ...answerClientResponse,
            correct: false
        })
    }
}