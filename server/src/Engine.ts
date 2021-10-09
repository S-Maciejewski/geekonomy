import {Country, Indicator, UserSession} from "./model";
import * as _ from 'lodash';
import {Repository} from "./Repository";

const supported = require('../config/supported.json')

const COUNTRIES_COUNT = 4
const INDICATORS_COUNT = 4

export interface EngineContract {
    generateQuizData(session: UserSession): Promise<UserSession>

    handleResult(session: UserSession): UserSession
}

export class Engine implements EngineContract {
    repository: Repository
    constructor() {
        this.repository = new Repository()
    }

    async generateQuizData(session: UserSession): Promise<UserSession> {
        const randomCountries: Country[] = _.sampleSize(supported.countries, COUNTRIES_COUNT)
        const randomIndicators: Indicator[] = _.sampleSize(supported.indicators, INDICATORS_COUNT)
        const correctCountry = randomCountries[0]
        session.state.quizData = await this.repository.fetchSingleCountryQuizData(correctCountry, randomIndicators)
        return session
    }

    handleResult(session: UserSession): UserSession {
        return session
    }
}