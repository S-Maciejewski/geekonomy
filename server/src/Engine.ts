import {GameState} from './GameState'
import {UserSession} from "./model";

const supported = require('../config/supported.json')
import * as _ from 'lodash';

const COUNTRIES_COUNT = 4
const INDICATORS_COUNT = 4

export interface EngineContract {
    generateQuiz(session: UserSession): UserSession

    handleResult(session: UserSession): UserSession
}

export class Engine implements EngineContract {
    constructor() {

    }

    generateQuiz(session: UserSession): UserSession {
        const randomCountries = _.sampleSize(supported.countries, COUNTRIES_COUNT)
        const randomIndicators = _.sampleSize(supported.indicators, INDICATORS_COUNT)


        return session
    }

    handleResult(session: UserSession): UserSession {
        return session
    }
}