export interface GameState {
    sessionId: string
    score: number
    indicators: IndicatorData[]
    countries: Country[]
}

export interface QuizData {
    indicators: IndicatorData[]
    countries: Country[]
}

export interface IndicatorData {
    series: [number, number][]
    indicator: Indicator
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
    sessionId: string
    score: number
    indicators: IndicatorData[]
    countries: Country[]
}

export interface AnswerClientResponse {
    sessionId: string
    score: number
    country: string
    correctCountry: string
    correct: boolean
}