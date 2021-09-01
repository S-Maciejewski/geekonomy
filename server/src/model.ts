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
    name: string
    code: string
}

export interface Country {
    name: string
    code: string
}