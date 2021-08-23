export interface GameState {
    score: number
    quizData: QuizData
}

export interface QuizData {
    indicators: IndicatorData[]
    countries: string[]
}

export interface IndicatorData {
    series: [number, number][]
    indicatorName: string
}
