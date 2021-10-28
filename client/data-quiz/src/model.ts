export interface GameState {
    sessionId: string
    score: number
    indicators: IndicatorData[]
    countries: Country[]
    lastAnswer?: LastAnswer
    controlsState: ControlsState
}

export interface IndicatorData {
    series: [number, number][]
    indicator: Indicator
}

export interface Country {
    name: string
    code?: string
}

export interface Indicator {
    name: string
    code?: string
}

export interface LastAnswer {
    country: string
    correctCountry: string
    correct: boolean
}

export interface QuizClientResponse {
    sessionId: string
    score: number
    indicators: IndicatorData[]
    countries: Country[]
}

export interface AnswerClientResponse extends LastAnswer {
    sessionId: string
    score: number
}

export enum ControlsState {
    DECISION_ENABLED,
    NEXT_QUIZ,
    NEW_GAME,
}