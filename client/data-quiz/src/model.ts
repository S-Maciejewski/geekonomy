export enum QuizStatus {
    NO_QUIZ = 'NO_QUIZ',
    FRESH_QUIZ = 'FRESH_QUIZ',
    QUIZ_ANSWERED = 'QUIZ_ANSWERED',
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
}

export interface Country {
    name: string
    code?: string
}

export interface Indicator {
    name: string
    code?: string
}

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

}