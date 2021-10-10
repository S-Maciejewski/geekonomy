import { GameState } from "./GameState";

export interface UserSession {
    sessionId: string
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

export interface Country {
    name: string
    code: string
}

export interface Indicator {
    name: string
    code: string
}

export interface QuizClientResponse {
    score: number
    indicators: IndicatorData[],
    countries: Country[]
}