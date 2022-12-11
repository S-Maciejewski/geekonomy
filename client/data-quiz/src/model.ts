export enum QuizStatus {
    NO_QUIZ = 'NO_QUIZ',
    FRESH_QUIZ = 'FRESH_QUIZ',
    QUIZ_ANSWERED = 'QUIZ_ANSWERED',
    REQUEST_SENT = 'REQUEST_SENT',
}

export interface GameState {
    sessionId: string
    score: number
    indicators: IndicatorData[]
    countries: Country[]
    quizStatus: QuizStatus
    lastAnswer?: LastAnswer
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

export interface LastAnswer {
    country: string
    correctCountry: string
    correct: boolean
}

export interface QuizServerResponse extends ServerResponse {
    indicators: IndicatorData[]
    countries: Country[]
}

export interface AnswerServerResponse extends ServerResponse, LastAnswer {
    indicators: IndicatorData[]
}
