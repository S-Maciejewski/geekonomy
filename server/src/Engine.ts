import {Country, Indicator, UserSession} from "./model";
import * as _ from 'lodash';
import {Repository} from "./Repository";

const supported = require('../config/supported.json')

export interface EngineContract {
    generateQuizData(session: UserSession): Promise<UserSession>

    handleResult(session: UserSession): UserSession
}

export class Engine implements EngineContract {
    COUNTRIES_COUNT = 4
    INDICATORS_COUNT = 4

    repository: Repository

    constructor() {
        this.repository = new Repository()
    }

    async generateQuizData(session: UserSession): Promise<UserSession> {
        const randomCountries: Country[] = _.sampleSize(supported.countries, this.COUNTRIES_COUNT)
        const randomIndicators: Indicator[] = _.sampleSize(supported.indicators, this.INDICATORS_COUNT)
        const correctCountry = randomCountries[0]
        session.state.updateQuizData({
            indicators: await this.repository.fetchSingleCountryQuizData(correctCountry, randomIndicators),
            countries: randomCountries,
            correctCountry
        })
        return session
    }

    handleResult(session: UserSession): UserSession {
        return session
    }
}