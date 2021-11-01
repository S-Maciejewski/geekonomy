import {GameState, QuizStatus} from "./GameState";

export interface UserSession {
    sessionId: string
    activeAt: number
    state: GameState
}

export interface QuizData {
    indicators: IndicatorData[]
    countries: Country[]
    correctCountry: Country
}

export interface IndicatorData {
    series: [number, number][]
    indicator: Indicator
    country?: Country
}

export type Country = string

export type Indicator = string

export interface ServerResponse {
    sessionId: string
    score: number
    quizStatus: QuizStatus
}

export interface QuizServerResponse extends ServerResponse {
    indicators: IndicatorData[]
    countries: Country[]
}

export interface AnswerServerResponse extends ServerResponse {
    country: string
    correctCountry: string
    correct: boolean
}